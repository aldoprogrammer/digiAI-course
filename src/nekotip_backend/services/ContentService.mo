import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

import Utils "../utils/Utils";
import Types "../types/Types";

module {
  // POST CONTENT
  public func postContent(
    contents : Types.Contents,
    caller : Principal,
    title : Text,
    description : Text,
    tier : Types.ContentTier,
    thumbnail : Text,
    contentImages : [Text],
  ) : Result.Result<Types.Content, Text> {
    // Check for anonymous caller
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous principals cannot post content");
    };

    // Validate title
    if (Text.size(title) < 3 or Text.size(title) > 100) {
      return #err("Title must be between 3 and 100 characters");
    };

    // Validate description
    if (description == "" or Text.size(description) > 1000) {
      return #err("Description must be between 1 and 1000 characters");
    };

    // Validate thumbnail
    if (thumbnail == "" or not _isValidUrl(thumbnail)) {
      return #err("Invalid thumbnail URL");
    };

    // Validate content images
    if (contentImages.size() > 10) {
      return #err("Maximum of 10 content images allowed");
    };

    // Validate individual content images
    for (image in contentImages.vals()) {
      if (image == "" or not _isValidUrl(image)) {
        return #err("Invalid content image URL");
      };
    };

    let contentId = Utils.generateUUID(caller, description);

    let newContent : Types.Content = {
      id = contentId;
      creatorId = caller;
      title = title;
      description = description;
      tier = tier;
      thumbnail = thumbnail;
      contentImages = contentImages;
      likes = [];
      comments = [];
      unlockedBy = [caller];
      createdAt = Time.now();
      updatedAt = null;
    };

    contents.put(contentId, newContent);
    #ok(newContent);
  };

  // Get all content previews
  public func getAllContentPreviews(contents : Types.Contents) : [Types.ContentPreview] {
    Iter.toArray(
      Iter.map(
        contents.vals(),
        func(content : Types.Content) : Types.ContentPreview {
          toContentPreview(content);
        },
      )
    );
  };

  // Get all creator content previews
  public func getCreatorContentPreview(
    contents : Types.Contents,
    creatorId : Principal,
  ) : [Types.ContentPreview] {
    // Filter contents by creator
    let creatorContents = Iter.filter(
      contents.vals(),
      func(content : Types.Content) : Bool {
        content.creatorId == creatorId;
      },
    );

    // Convert to content previews
    let contentPreviews = Iter.map(
      creatorContents,
      func(content : Types.Content) : Types.ContentPreview {
        toContentPreview(content);
      },
    );

    // Convert to array and return
    Iter.toArray(contentPreviews);
  };

  // Get purchased content list
  public func getPurchasedContentPreviews(
    transactions : Types.Transactions,
    contents : Types.Contents,
    user : Principal,
  ) : [Types.ContentPreview] {
    let purchasedContentIds = Array.mapFilter<Types.Transaction, Text>(
      Iter.toArray(transactions.vals()),
      func(tx) {
        if (
          tx.from == user and
          tx.transactionType == #contentPurchase and
          tx.txStatus == #completed
        ) {
          switch (tx.contentId) {
            case (null) { null };
            case (?id) { ?id };
          };
        } else {
          null;
        };
      },
    );

    Array.mapFilter<Text, Types.ContentPreview>(
      purchasedContentIds,
      func(contentId) {
        switch (contents.get(contentId)) {
          case (null) { null };
          case (?content) { ?toContentPreview(content) };
        };
      },
    );
  };

  // Get content details with access control
  public func getContentDetails(
    contents : Types.Contents,
    caller : Principal,
    contentId : Text,
  ) : Result.Result<Types.Content, ?Types.ContentPreview> {
    switch (contents.get(contentId)) {
      case (?content) {
        if (hasAccess(content, caller)) {
          #ok(content);
        } else {
          #err(?toContentPreview(content));
        };
      };
      case (null) { #err(null) };
    };
  };

  // Get creator's content (full content for owned content, previews for others)
  public func getCreatorContent(
    contents : Types.Contents,
    caller : Principal,
    creatorId : Principal,
  ) : [Result.Result<Types.Content, Types.ContentPreview>] {
    Iter.toArray(
      Iter.map(
        Iter.filter(
          contents.vals(),
          func(content : Types.Content) : Bool {
            content.creatorId == creatorId;
          },
        ),
        func(content : Types.Content) : Result.Result<Types.Content, Types.ContentPreview> {
          if (hasAccess(content, caller)) {
            #ok(content);
          } else {
            #err(toContentPreview(content));
          };
        },
      )
    );
  };

  // LIKE/UNLIKE CONTENT
  public func toggleLike(
    contents : Types.Contents,
    caller : Principal,
    contentId : Text,
  ) : Result.Result<Types.Content, Text> {
    switch (contents.get(contentId)) {
      case (?content) {
        let hasLiked = Array.find<Principal>(
          content.likes,
          func(p) { Principal.equal(p, caller) },
        );

        let updatedLikes = switch (hasLiked) {
          // If not liked, add like
          case (null) {
            Array.append(content.likes, [caller]);
          };
          // If already liked, remove like
          case (?_) {
            Array.filter<Principal>(
              content.likes,
              func(p) { not Principal.equal(p, caller) },
            );
          };
        };

        let updatedContent = {
          content with
          likes = updatedLikes;
          updatedAt = ?Time.now();
        };

        contents.put(contentId, updatedContent);
        #ok(updatedContent);
      };
      case (null) { #err("Content not found") };
    };
  };

  // POST COMMENT
  public func addComment(contents : Types.Contents, caller : Principal, contentId : Text, comment : Text) : Result.Result<Types.Comment, Text> {
    switch (contents.get(contentId)) {
      case (?content) {
        let commentId = Utils.generateUUID(caller, comment);

        let newComment : Types.Comment = {
          id = commentId;
          commenter = caller;
          contentId = contentId;
          text = comment;
          createdAt = Time.now();
          updatedAt = null;
        };

        let updatedContent = {
          content with
          comments = Array.append(content.comments, [newComment]);
          updatedAt = ?Time.now();
        };
        contents.put(contentId, updatedContent);
        #ok(newComment);
      };
      case (null) { #err("Content not found") };
    };
  };

  // GET COMMENTS
  public func getContentComments(
    contents : Types.Contents,
    caller : Principal,
    contentId : Text,
  ) : Result.Result<[Types.Comment], Text> {
    switch (contents.get(contentId)) {
      case (?content) {
        // For paid content, check if user has access
        switch (content.tier) {
          case (#Free) { #ok(content.comments) };
          case (_) {
            if (hasAccess(content, caller)) {
              #ok(content.comments);
            } else {
              #err("Must unlock content to view comments");
            };
          };
        };
      };
      case (null) { #err("Content not found") };
    };
  };

  // DELETE CONTENT
  public func deleteContent(
    contents : Types.Contents,
    caller : Principal,
    contentId : Text,
  ) : Result.Result<(), Text> {
    switch (contents.get(contentId)) {
      case (?content) {
        // Only content creator can delete
        if (not Principal.equal(content.creatorId, caller)) {
          #err("Only content creator can delete this content");
        } else {
          contents.delete(contentId);
          #ok(());
        };
      };
      case (null) { #err("Content not found") };
    };
  };

  // DELETE COMMENT
  public func deleteComment(
    contents : Types.Contents,
    caller : Principal,
    contentId : Text,
    commentId : Text,
  ) : Result.Result<Types.Content, Text> {
    switch (contents.get(contentId)) {
      case (?content) {
        // Find the comment
        let commentOpt = Array.find<Types.Comment>(
          content.comments,
          func(c) { Text.equal(c.id, commentId) },
        );

        switch (commentOpt) {
          case (?comment) {
            // Check if caller is comment author or content creator
            if (
              not Principal.equal(comment.commenter, caller) and
              not Principal.equal(content.creatorId, caller)
            ) {
              #err("Only comment author or content creator can delete this comment");
            } else {
              // Remove the comment
              let updatedComments = Array.filter<Types.Comment>(
                content.comments,
                func(c) { not Text.equal(c.id, commentId) },
              );

              let updatedContent = {
                content with
                comments = updatedComments;
                updatedAt = ?Time.now();
              };

              contents.put(contentId, updatedContent);
              #ok(updatedContent);
            };
          };
          case (null) { #err("Comment not found") };
        };
      };
      case (null) { #err("Content not found") };
    };
  };

  // FUTURE:=======
  // EDIT CONTENT
  // EDIT COMMENT
  // ==============

  // UTILS
  // Helper function to convert Content to ContentPreview
  private func toContentPreview(content : Types.Content) : Types.ContentPreview {
    {
      id = content.id;
      creatorId = content.creatorId;
      title = content.title;
      description = content.description;
      tier = content.tier;
      thumbnail = content.thumbnail;
      likesCount = content.likes.size();
      commentsCount = content.comments.size();
      createdAt = content.createdAt;
      unlockedBy = content.unlockedBy;
    };
  };

  // Helper function to check if user has access to content
  private func hasAccess(content : Types.Content, user : Principal) : Bool {
    switch (content.tier) {
      case (#Free) { true };
      case (_) {
        Array.find<Principal>(content.unlockedBy, func(p) { Principal.equal(p, user) }) != null;
      };
    };
  };

  // Helper function to validate URLs (basic implementation)
  private func _isValidUrl(url : Text) : Bool {
    // Basic URL validation
    if (url == "") return false;

    // Check for http or https protocol
    let hasValidProtocol = Text.startsWith(url, #text("http://")) or Text.startsWith(url, #text("https://"));

    // Check for basic domain structure
    let hasDomain = Text.contains(url, #text("."));

    return hasValidProtocol and hasDomain;
  };
};

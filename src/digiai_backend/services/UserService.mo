import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";

import ledger "canister:icp_ledger_canister";
import Types "../types/Types";
import Utils "../utils/Utils";

module {
  // LOGIN/REGISTER
  public func authenticateUser(
    users : Types.Users,
    userId : Principal,
    username : Text,
    depositAddress : Text,
    referralCode : ?Text,
  ) : Result.Result<Types.User, Text> {

    // Input validation
    if (Text.size(username) < 3 or Text.size(username) > 20) {
      return #err("Username must be between 3 and 20 characters");
    };

    if (Text.size(depositAddress) == 0) {
      return #err("Deposit address cannot be empty");
    };

    // Check if principal is valid
    if (Principal.isAnonymous(userId)) {
      return #err("Anonymous principals are not allowed");
    };

    // Check if username already exists
    for ((id, user) in users.entries()) {
      if (Text.equal(user.username, username)) {
        // If the username matches but belongs to a different user, throw an error
        if (id != userId) {
          return #err("USERNAME_TAKEN: The username '" # username # "' is already in use.");
        };
      };
    };

    switch (users.get(userId)) {
      // If user exists, return their data
      case (?existingUser) {
        #ok(existingUser);
      };
      // If user doesn't exist, create new user
      case null {
        var referredBy : ?Principal = null;

        // Handle referral
        switch (referralCode) {
          case null {};
          case (?code) {
            referredBy := findUserByReferralCode(users, code);
          };
        };

        // Generate referral code
        let newReferralCode = generateReferral(userId);

        // INIT USER SOCIALS
        let socials : Types.Socials = {
          twitter = null;
          instagram = null;
          tiktok = null;
          youtube = null;
          discord = null;
          twitch = null;
          website = null;
          facebook = null;
        };

        let newUser : Types.User = {
          id = userId;
          username = username;
          name = ?username;
          referralCode = newReferralCode;
          depositAddress = depositAddress;
          socials = socials;
          followers = [];
          following = [];
          referrals = [];
          categories = [];
          createdAt = Time.now();
          bio = null;
          profilePic = null;
          bannerPic = null;
          referredBy = referredBy;
        };

        // Add new user to the hashmap
        users.put(userId, newUser);

        // Update referrer's referrals if applicable
        switch (referredBy) {
          case null {};
          case (?refId) {
            updateReferrerReferrals(users, refId, userId);
          };
        };

        #ok(newUser);
      };
    };

  };

  // UPDATE USER PROFILE
  public func updateUserProfile(
    users : Types.Users,
    userId : Principal,
    updateData : Types.UserUpdateData,
  ) : Result.Result<Types.User, Text> {
    // Check if principal is valid
    if (Principal.isAnonymous(userId)) {
      return #err("Anonymous principals are not allowed");
    };

    switch (users.get(userId)) {
      case (null) {
        return #err("User not found!");
      };
      case (?user) {
        // USERNAME
        let username = switch (updateData.username) {
          case (null) { user.username };
          case (?newUsername) {
            if (Text.size(newUsername) < 3 or Text.size(newUsername) > 20) {
              return #err("Username must be between 3 and 20 characters");
            };

            if (newUsername != user.username) {
              for ((id, existingUser) in users.entries()) {
                if (id != userId and Text.equal(existingUser.username, newUsername)) {
                  return #err("USERNAME_TAKEN: The username '" # newUsername # "' is already in use.");
                };
              };
            };
            newUsername;
          };
        };

        // BIO
        let bio = switch (updateData.bio) {
          case (null) { user.bio };
          case (?newBio) {
            if (Text.size(newBio) > 100) {
              return #err("Bio must be 100 characters or less");
            };
            ?newBio;
          };
        };

        // SOCIALS
        let socials = switch (updateData.socials) {
          case (null) { user.socials };
          case (?newSocials) {
            {
              twitter = newSocials.twitter;
              instagram = newSocials.instagram;
              tiktok = newSocials.tiktok;
              youtube = newSocials.youtube;
              discord = newSocials.discord;
              twitch = newSocials.twitch;
              website = newSocials.website;
              facebook = newSocials.facebook;
            };
          };
        };

        // NAME
        let name = switch (updateData.name) {
          case (null) { user.name };
          case (?newName) { ?newName };
        };

        // PROFILE PIC
        let profilePic = switch (updateData.profilePic) {
          case (null) { user.profilePic };
          case (?newProfilePic) { ?newProfilePic };
        };

        // BANNER PIC
        let bannerPic = switch (updateData.bannerPic) {
          case (null) { user.bannerPic };
          case (?newBannerPic) { ?newBannerPic };
        };

        // CATEGORIES
        let categories = switch (updateData.categories) {
          case (null) { user.categories };
          case (?newCategories) { newCategories };
        };

        let updatedUser : Types.User = {
          id = user.id;
          referralCode = user.referralCode;
          depositAddress = user.depositAddress;
          followers = user.followers;
          following = user.following;
          createdAt = user.createdAt;
          referredBy = user.referredBy;
          referrals = user.referrals;

          // UPDATE FIELD
          username = username;
          bio = bio;
          socials = socials;
          name = name;
          profilePic = profilePic;
          bannerPic = bannerPic;
          categories = categories;
        };

        users.put(userId, updatedUser);
        #ok(updatedUser);
      };
    };
  };

  // FOLLOW/UNFOLLOW USER
  public func toggleFollow(
    users : Types.Users,
    currentUserId : Principal,
    userToToggleId : Principal,
  ) : Result.Result<Text, Text> {

    // Input validation
    if (Principal.isAnonymous(currentUserId) or Principal.isAnonymous(userToToggleId)) {
      return #err("Anonymous principals are not allowed");
    };

    if (currentUserId == userToToggleId) {
      return #err("You cannot follow/unfollow yourself");
    };

    switch (users.get(currentUserId), users.get(userToToggleId)) {
      case (?currentUser, ?userToToggle) {
        let isFollowing = Array.indexOf(userToToggleId, currentUser.following, Principal.equal);

        if (isFollowing == null) {
          // Follow user
          let updatedCurrentUser = {
            currentUser with
            following = Array.append(currentUser.following, [userToToggleId])
          };
          let updatedUserToToggle = {
            userToToggle with
            followers = Array.append(userToToggle.followers, [currentUserId])
          };

          users.put(currentUserId, updatedCurrentUser);
          users.put(userToToggleId, updatedUserToToggle);

          #ok("You are now following " # userToToggle.username);
        } else {
          // Unfollow user
          let updatedCurrentUser = {
            currentUser with
            following = Array.filter(currentUser.following, func(id : Principal) : Bool { id != userToToggleId })
          };
          let updatedUserToToggle = {
            userToToggle with
            followers = Array.filter(userToToggle.followers, func(id : Principal) : Bool { id != currentUserId })
          };

          users.put(currentUserId, updatedCurrentUser);
          users.put(userToToggleId, updatedUserToToggle);

          #ok("You have unfollowed " # userToToggle.username);
        };
      };
      case (null, _) { #err("Current user not found") };
      case (_, null) { #err("User to follow/unfollow not found") };
    };

  };

  // GET USER BY USERNAME
  public func getUserByUsername(users : Types.Users, username : Text) : ?Types.User {
    for ((principal, user) in users.entries()) {
      if (user.username == username) {
        return ?user;
      };
    };
    return null;
  };

  // GET FOLLOWERS
  public func getFollowers(users : Types.Users, userId : Principal) : [Types.User] {
    switch (users.get(userId)) {
      case (null) { [] };
      case (?_user) {
        let followers = Buffer.Buffer<Types.User>(0);
        for ((_, otherUser) in users.entries()) {
          if (Array.indexOf(userId, otherUser.following, Principal.equal) != null) {
            followers.add(otherUser);
          };
        };
        Buffer.toArray(followers);
      };
    };
  };

  // GET FOLLOWING
  public func getFollowing(users : Types.Users, userId : Principal) : [Types.User] {
    switch (users.get(userId)) {
      case (null) { [] };
      case (?user) {
        let following = Buffer.Buffer<Types.User>(0);
        for (followedId in user.following.vals()) {
          switch (users.get(followedId)) {
            case (null) {};
            case (?followedUser) {
              following.add(followedUser);
            };
          };
        };
        Buffer.toArray(following);
      };
    };
  };

  // GET REFERRALS
  public func getReferrals(users : Types.Users, userId : Principal) : [Types.User] {
    switch (users.get(userId)) {
      case (null) { [] };
      case (?_user) {
        let referrals = Buffer.Buffer<Types.User>(0);
        for ((_, otherUser) in users.entries()) {
          switch (otherUser.referredBy) {
            case (null) {};
            case (?referrerId) {
              if (Principal.equal(referrerId, userId)) {
                referrals.add(otherUser);
              };
            };
          };
        };
        Buffer.toArray(referrals);
      };
    };
  };

  // GET ICP BALANCE
  public func getAccountBalance(principalId : Principal) : async Nat {
    let balance = await ledger.icrc1_balance_of({
      owner = principalId;
      subaccount = null;
    });
    return balance;
  };

  // GET CREDIT BALANCE
  public func getCreditBalance(userBalances : Types.UserBalances, userId : Principal) : Types.UserBalance {
    switch (userBalances.get(userId)) {
      case (null) {
        { balance = 0; id = userId };
      };
      case (?balance) { balance };
    };
  };

  // UTILS
  private func generateReferral(principal : Principal) : Text {
    let principalText = Principal.toText(principal);
    let hashedText = Nat32.toText(Text.hash(principalText));
    let referral = Utils.substr(hashedText, 0, 8);

    return referral;
  };

  private func findUserByReferralCode(users : Types.Users, code : Text) : ?Principal {
    for ((id, user) in users.entries()) {
      if (user.referralCode == code) {
        return ?id;
      };
    };
    null;
  };

  private func updateReferrerReferrals(users : Types.Users, referrerId : Principal, newUserId : Principal) {
    switch (users.get(referrerId)) {
      case (?referrer) {
        let updatedReferrer = {
          referrer with
          referrals = Array.append(referrer.referrals, [newUserId])
        };
        users.put(referrerId, updatedReferrer);
      };
      case null {};
    };
  };

};

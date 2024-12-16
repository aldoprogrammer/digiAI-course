import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronDown, XIcon } from 'lucide-react';

import Button from '@/components/ui/Button/Button';
import CustomFileInput from '@/components/ui/Input/CustomFIleInput';
import { CustomInput } from '@/components/ui/Input/CustomInput';
import { CustomTextarea } from '@/components/ui/Input/CustomTextarea';
import useUploadImage from '@/hooks/useUploadImage';
import useUploadMultipleImages from '@/hooks/useUploadMultipleImages';
import { ContentTierOptions } from '@/lib/utils';
import { useAuthManager } from '@/store/AuthProvider';

const CreatePostForm = () => {
  const navigate = useNavigate();
  const { actor } = useAuthManager();

  // Thumbnail upload hook
  const {
    preview: thumbnailPreview,
    selectedFile: thumbnailFile,
    uploading: isThumbnailUploading,
    handleFileChange: handleThumbnailChange,
    uploadImage: uploadThumbnail,
    resetUpload: resetThumbnailUpload,
  } = useUploadImage(5, ['image/']);

  // Content images upload hook
  const {
    previews,
    selectedFiles,
    uploading,
    handleFilesChange,
    uploadImages,
    resetUpload,
    removeContentImage,
  } = useUploadMultipleImages(5, ['image/'], 5);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentTier, setContentTier] = useState<any>(''); // This holds the selected tier
  const [youtubeLink, setYoutubeLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Validate form before submission
  const validateForm = () => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push('Title is required');
    }

    if (!description.trim()) {
      errors.push('Description is required');
    }

    if (!contentTier) {
      errors.push('Content tier must be selected');
    }

    if (!thumbnailFile) {
      errors.push('Thumbnail is required');
    }

    if (!selectedFiles) {
      errors.push('At least one content image is required');
    }

    if (youtubeLink && !/^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+$/.test(youtubeLink)) {
      errors.push('Invalid YouTube link');
    }

    setFormErrors(errors);
    return errors.length === 0;
  };

  // Handle post creation
  const handleCreateNewPost = async () => {
    // Validate form first
    if (!validateForm()) return alert(formErrors.map((e) => e));

    try {
      setLoading(true);

      // Upload thumbnail
      let uploadedThumbnailUrl: string | null = '';
      if (thumbnailFile) {
        uploadedThumbnailUrl = await uploadThumbnail();
        if (!uploadedThumbnailUrl) {
          setLoading(false);
          return;
        }
      }

      // Upload content images
      let uploadedContentImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        uploadedContentImageUrls = await uploadImages();

        // If content image upload fails, stop post creation
        if (uploadedContentImageUrls.length === 0) {
          setLoading(false);
          return;
        }
      }

      if (actor) {
        const result = await actor.postContent(
          title,
          description,
          contentTier.value,
          uploadedThumbnailUrl, // Thumbnail
          uploadedContentImageUrls, // Content Images
          // youtubeLink // YouTube Link
        );

        if ('ok' in result) {
          // Reset form and navigate to content page
          resetForm();
          navigate(`/courses/content/${result.ok.id}`);
        } else {
          console.error('Error creating post', result.err);
          setFormErrors([result.err.toString()]);
        }
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setFormErrors(['An unexpected error occurred']);
    } finally {
      setLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContentTier(''); // Reset the content tier
    setYoutubeLink(''); // Reset YouTube link
    resetThumbnailUpload();
    resetUpload();
    setFormErrors([]);
  };

  return (
    <div className="mt-3 rounded-lg border border-border px-5 py-4 shadow-custom">
      <CustomInput
        label="Title"
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
       {/* YouTube Link Field */}
       <div className="mt-4">
        <label className="mb-2 block font-semibold text-subtext">YouTube Video Link</label>
        <CustomInput
          type="url"
          placeholder="Paste YouTube video link"
          value={youtubeLink}
          onChange={(e) => setYoutubeLink(e.target.value)}
        />
      </div>
      <CustomTextarea
        containerClassName="mt-2 md:mt-4"
        textareaClassName="md:min-h-[100px]"
        label="Description"
        placeholder={'Description about your post'}
        maxLength={1000}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Tier Selection using buttons */}
      <p className="mb-2 mt-2 font-semibold text-subtext md:mt-4">Price to Enrolled</p>
      <div className="flex space-x-3">
        {ContentTierOptions.map((option) => (
          <Button
            key={option.label} // Use label as key
            variant={contentTier?.value === option.value ? 'main' : 'secondary'}
            size="default"
            onClick={() => setContentTier(option)}
            className="px-4 py-2"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Thumbnail Upload */}
      <div className="mt-4">
        <label className="mb-2 block font-semibold text-subtext">Thumbnail</label>
        <div className="space-y-5">
          <CustomFileInput
            onChange={handleThumbnailChange}
            placeholder="Upload thumbnail"
            containerClassName="max-w-[300px]"
          />

          {thumbnailPreview && (
            <div className="relative w-fit">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="h-48 w-full rounded-lg object-cover"
              />
              <button
                onClick={resetThumbnailUpload}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1"
              >
                <XIcon className="h-3 w-3 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Images Upload */}
      <div className="mt-4">
        <label className="mb-2 block font-semibold text-subtext">Content Images</label>
        <div className="space-y-5">
          <CustomFileInput
            onChange={handleFilesChange}
            placeholder="Upload images"
            className="max-w-[300px]"
          />

          <div className="flex flex-wrap items-center gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="relative w-fit">
                <img
                  src={preview}
                  alt={`Content Image ${index + 1}`}
                  className="h-32 w-full rounded-lg object-cover md:w-40"
                />
                <button
                  onClick={() => removeContentImage(index)}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1"
                >
                  <XIcon className="h-3 w-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

     

      <div className="flex w-full md:justify-end">
        <Button
          variant="secondary"
          disabled={loading || uploading || isThumbnailUploading}
          onClick={handleCreateNewPost}
          className="mb-3 mt-5 w-full md:w-[300px]"
        >
          {loading || uploading || isThumbnailUploading
            ? 'Creating..'
            : 'Create Course'}
        </Button>
      </div>
    </div>
  );
};

export default CreatePostForm;

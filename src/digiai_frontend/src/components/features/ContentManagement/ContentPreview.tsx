import { MessageSquareIcon, ThumbsUpIcon } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface ContentPreviewProps {
  title: string;
  description: string;
  tier: string;
  youtubeLink: string;
  thumbnail: string;
  likesCount: string;
  commentsCount: string;
  createdAt: string;
  isUnlocked?: boolean;
  className?: string;
}

const ContentPreview = ({
  commentsCount,
  description,
  likesCount,
  thumbnail,
  tier,
  title,
  youtubeLink,
  createdAt,
  isUnlocked,
  className,
}: ContentPreviewProps) => {
  return (
    <div
      className={cn(
        'min-w-[300px] max-w-md cursor-pointer rounded-lg border bg-white shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl',
        className
      )}
    >
      {/* Thumbnail Image */}
      <img
        src={thumbnail}
        alt={title}
        className="h-40 w-full rounded-t-lg object-cover bg-gray-200"
      />
      <div className="p-5">
        {/* Title */}
        <h2 className="text-xl font-semibold text-title mb-2 truncate">{title}</h2>
        
        {/* Description */}
        <p className="text-sm text-caption mb-3 line-clamp-3">{description}</p>
        
        {/* Date */}
        <p className="text-xs text-gray-500">{createdAt}</p>

        <div className="mt-4 flex items-center justify-between">
          {/* Interaction Icons */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-gray-600">
              <ThumbsUpIcon className="h-5 w-5" />
              {likesCount}
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MessageSquareIcon className="h-5 w-5" />
              {commentsCount}
            </div>
          </div>

          {/* Tier Badge */}
          <p
            className={cn(
              'px-4 py-1 rounded-lg text-xs font-medium flex items-center justify-center text-white',
              tier === 'Free'
                ? 'bg-green-500'
                : isUnlocked
                ? 'bg-blue-500'
                : 'bg-gray-600'
            )}
          >
            {tier === 'Free' ? 'Free' : isUnlocked ? 'Unlocked' : tier}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentPreview;

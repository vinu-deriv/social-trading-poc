import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type User from "@/types/user.types";
import { UserType } from "@/types/user.types";
import ActionSheet from "@/components/modal/ActionSheet";
import type { ActionSheetAction } from "@/components/modal/ActionSheet";
import FullscreenModal from "@/components/modal/FullscreenModal/FullscreenModal";
import PostForm from "@/modules/feed/components/PostForm";
import CreatePostIcon from "@/assets/icons/CreatePostIcon";
import CreateStrategyIcon from "@/assets/icons/CreateStrategyIcon";

interface CreateContentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (content: { text: string; images: string[] }) => Promise<any>;
  onCreateStrategy: () => void;
  userType: UserType;
  currentUser: User;
}

const CreateContentSheet: React.FC<CreateContentSheetProps> = ({
  isOpen,
  onClose,
  onCreatePost,
  onCreateStrategy,
  userType,
  currentUser,
}) => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [shouldShowPostForm, setShouldShowPostForm] = useState(false);

  const handleCreatePost = () => {
    setShouldShowPostForm(true); // Set flag to show post form after ActionSheet closes
    onClose(); // Close the action sheet
  };

  const handleActionSheetExited = () => {
    if (shouldShowPostForm) {
      setShowPostForm(true); // Show the post form after action sheet closes
      setShouldShowPostForm(false); // Reset the flag
    }
  };

  const navigate = useNavigate();

  const handlePostFormClose = () => {
    setShowPostForm(false);
    setShouldShowPostForm(false); // Reset the flag when post form is closed
  };

  const handlePostSubmit = async (content: { text: string; images: string[] }) => {
    try {
      const newPost = await onCreatePost(content);
      if (newPost?.id) {
        handlePostFormClose();
        navigate(`/posts/${newPost.id}`);
      } else {
        console.error("Failed to create post: No post ID returned");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      // TODO: Show error message to user
    }
  };

  const actions: ActionSheetAction[] = [
    {
      icon: <CreatePostIcon />,
      label: "Create Post",
      onClick: handleCreatePost,
    },
    ...(userType === UserType.LEADER
      ? [
          {
            icon: <CreateStrategyIcon />,
            label: "Create Strategy",
            onClick: onCreateStrategy,
          },
        ]
      : []),
  ];

  return (
    <>
      <ActionSheet
        isOpen={isOpen}
        onClose={onClose}
        onExited={handleActionSheetExited}
        actions={actions}
        title="Create Content"
      />
      <FullscreenModal
        isOpen={showPostForm}
        onClose={handlePostFormClose}
        title="Create Post"
      >
        <PostForm
          currentUser={currentUser}
          onSubmit={handlePostSubmit}
          onClose={handlePostFormClose}
        />
      </FullscreenModal>
    </>
  );
};

export default CreateContentSheet;

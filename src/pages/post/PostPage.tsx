import { useState, useEffect } from 'react';
import type Post from '@/types/post.types';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import FeedItem from '@/modules/feed/components/FeedList/components/FeedItem';
import { getPost } from '@/modules/feed/services/postService';
import useCurrentUser from '@/modules/feed/hooks/useCurrentUser';
import Loader from '@/components/layout/Loader';
import BackIcon from '@/assets/icons/BackIcon';
import './PostPage.css';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { user: currentUser } = useCurrentUser(user?.id || '');
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      try {
        const data = await getPost(postId);
        setPost(data);
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="post-page">
        <header className="post-page__header">
          <button onClick={handleBack} className="post-page__back">
            <BackIcon />
          </button>
          <h1 className="post-page__title">Post</h1>
        </header>
        <div className="post-page__loading">
          <Loader />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-page">
        <header className="post-page__header">
          <button onClick={handleBack} className="post-page__back">
            <BackIcon />
          </button>
          <h1 className="post-page__title">Post</h1>
        </header>
        <div className="post-page__error">{error || 'Post not found'}</div>
      </div>
    );
  }

  return (
    <div className="post-page">
      <header className="post-page__header">
        <button onClick={handleBack} className="post-page__back">
          <BackIcon />
        </button>
        <h1 className="post-page__title">Post</h1>
      </header>
      <main className="post-page__content">
        {currentUser && <FeedItem post={post} user={currentUser} currentUserId={user?.id || ''} />}
      </main>
    </div>
  );
};

export default PostPage;

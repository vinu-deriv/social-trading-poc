import { useState } from "react";
import { createPost } from "@/modules/feed/services/postService";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/layouts/Header";
import AppContent from "@/layouts/AppContent";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import CreateContentSheet from "@/components/content/CreateContentSheet";
import "./MainLayout.css";

const MainLayout = () => {
    const { user } = useAuth();
    const [showActionSheet, setShowActionSheet] = useState(false);

    const handleCreatePost = async (content: { text: string; images: string[] }) => {
        if (!user) return;
        const newPost = await createPost({
            userId: user.id,
            content
        });
        return newPost;
    };

    const handleCreateStrategy = () => {
        setShowActionSheet(false);
        // TODO: Implement strategy creation
        console.log("Create strategy clicked");
    };

    return (
        <div className="main-layout">
            <Header />
            <AppContent>
                <Outlet />
            </AppContent>
            <BottomNavigation onCreateContent={() => setShowActionSheet(true)} />

            {user && (
                <CreateContentSheet
                    isOpen={showActionSheet}
                    onClose={() => setShowActionSheet(false)}
                    onCreatePost={handleCreatePost}
                    onCreateStrategy={handleCreateStrategy}
                    userType={user.userType}
                    currentUser={user}
                />
            )}
        </div>
    );
};

export default MainLayout;

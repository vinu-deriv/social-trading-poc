import { PropsWithChildren } from "react";
import "./AppContent.css";

const AppContent = ({ children }: PropsWithChildren) => {
    return <main className="app-content">{children}</main>;
};

export default AppContent;

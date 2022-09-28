import React, { useEffect, useState, useCallback } from "react";
import useStore from "../store.js";

export const LoadingCurtain = () => {
  const colorName = useStore((store) => store.curtainColor);
  const loading = useStore((store) => store.loading);
  const post = useStore((store) => store.post);
  return (
    <div
      className={
        "loading-curtain background-" + colorName + (loading ? " visible" : "")
      }
    >
      <div>
        Loading...
        {post && (
          <div>
            <b>"{post.title ? post.title : "Untitled"}"</b>
            <br />
            by {post.user.name ? post.user.name : post.user.id.slice(0, 6)}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingCurtain;

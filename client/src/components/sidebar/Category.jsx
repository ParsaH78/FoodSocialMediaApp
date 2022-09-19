import React, { useEffect, useState } from 'react';
import "./sidebar.css";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import CategoryButton from './CategoryButton';


export default function Category({cat, filteredPost, SetFilteredPost}) {

    const [subShow, setSubShow] = useState(true);
    const [subCategoryStyle, setSubCategoryStyle] = useState("categoryItemList");

    const showSubCategory = () => {
        setSubShow(!subShow);
        if (subShow) {
          setSubCategoryStyle(prev => prev.concat(" showSub"));
        } else {
          setSubCategoryStyle(prev => prev.replace(" showSub", ""));

        }
      }


  return (
    <div className="categoryDetails">
        <li className='"categoryName'>
          <LocalDiningIcon className="CategoryIcon" fontSize="small" />
          <button  className="showButton" onClick={() => showSubCategory()}>
            {cat.name}
          </button>
        </li>
        <ul className={subCategoryStyle}>
          {cat.value.map(c => (
            <CategoryButton
            key={c} 
            category={c}
            filteredPost={filteredPost}
            SetFilteredPost={SetFilteredPost}
            />
          ))}
        </ul>
  </div>
  )
}

import React, { useState } from 'react'
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';

export default function CategoryButton({category, filteredPost, SetFilteredPost}) {

  const [subButtonStyle, setSubButtonStyle] = useState("showButton");

  const filterResult = (e) => {
    if (filteredPost.includes(e.target.value )) {
      SetFilteredPost(current => current.filter(element => {return element !== e.target.value}));
      setSubButtonStyle(prev => prev.replace(" selectedButton", ""));
    } else {
      SetFilteredPost([...filteredPost, e.target.value]);
      setSubButtonStyle(prev => prev.concat(" selectedButton"));
    }
  }

  return (
    <li>
    <LocalPizzaIcon className="subCategoryIcon" fontSize='small'/>
    <button className={subButtonStyle} value={category} onClick={(e) => filterResult(e)}>
      {category}
    </button>
  </li>
  )
}

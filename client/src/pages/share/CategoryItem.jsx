import React, { useEffect, useState } from 'react';
import "./shareFood.css";

export default function CategoryItem({value, categories, setCategories}) {
    const [buttonStyle, setButtonStyle] = useState(null);

    useEffect(() => {
        setButtonStyle(categories.includes(value) ? 'catButton showCatButton' : 'catButton');
    }, [categories]);

    const handleCheckbox = (e) => {
        e.preventDefault();
        if (!categories.includes(value)) {
            setCategories([...categories, e.target.value]);
            setButtonStyle(prev => prev.concat(" showCatButton"));
        } else {
            const index = categories.indexOf(e.target.value);
            categories.splice(index, 1);
            setCategories(categories);
            setButtonStyle(prev => prev.replace(" showCatButton", ""));
        }
    }

  return (
    <div className="categoryItem">
        <button className={buttonStyle} value={value} onClick={(e) => handleCheckbox(e)}>{value}</button>
        {/* <input type="checkbox" id={`cat${v}`} className="cat" value={v}  onChange={(e) => handleCheckbox(e)}/>
        <label for={`cat${v}`} className='foodCat'>{v}</label> */}
    </div>
  )
}

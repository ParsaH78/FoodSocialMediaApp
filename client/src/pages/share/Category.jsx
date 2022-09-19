import React from 'react';
import CategoryItem from './CategoryItem';

export default function Category({name, value, categories, setCategories}) {

  return (
    <div className='categoryBox'>
    <span className="categoryText">{name}</span>
    <hr className='categoryLine'/>
    {value.map((v) => (
        <CategoryItem value={v} categories={categories} setCategories={setCategories}/>
    ))}
    </div>
  )
}

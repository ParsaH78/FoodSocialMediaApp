import React, { useState, useEffect } from 'react'
import "./shareFood.css";
import {FoodCategory} from "../../dummyData";
import Topbar from '../../components/topbar/Topbar'
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Category from './Category';
import { useSelector, useDispatch } from "react-redux";
import {getMe} from "../../actions/UserActions";
import { createPost, updatePost} from "../../actions/PostActions";
import Sidebar from '../../components/sidebar/Sidebar';

export default function ShareFood({post}) {

    const initialData = {name: '', explain: '', 
    desc: [], ingredients: [], readytime: 30, 
    category: [], vegan: false, 
    img: '', rating: [], comments: [], people: 1};
    const { currentUser: user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [file, setFile] = useState([]);
    const [data, setData] = useState(initialData);
    const [categories, setCategories] = useState([]);
    const [vegan, setVegan] = useState(false);
    const [ingredient, setIngredient] = useState([{name: '', amount: '', type: ''}]);
    const [desc, setDesc] = useState([{explain : ''}]);
    document.title = post ? `ویرایش دستورپخت ${post.name}` : 'دستورپخت جدید';

    useEffect(() => {
        dispatch(getMe());
      }, []);

    useEffect(() => {
        if (post) {
            setIngredient(post.ingredients);
            setDesc(post.desc);
            setCategories(post.category);
            if (post.vegan === "true") {
                setVegan(true);
            }
            setData({
                name: post.name,
                explain: post.explain,
                desc: post.date,
                ingredients: post.ingredients,
                readytime: post.readytime,
                category: post.category,
                vegan: post.vegan,
                img: post.img,
                rating: post.rating,
                comments: post.comments,
                people: post?.people
            });
        }
    }, []);


    const handleIngredientChange = (e, index) => {
            const { name, value } = e.target;
            const list = [...ingredient];
            list[index][name] = value;
            setIngredient(list);
    };
    
    const handleIngredientRemove = (index) => {
            const list = [...ingredient];
            list.splice(index, 1);
            setIngredient(list);
    };
    
    const handleIngredientAdd = () => {
        setIngredient([...ingredient, {name: '', amount: '', type: ''}]);
    };

    const handleDescChange = (e, index,) => {
            const { name, value } = e.target;
            const list = [...desc];
            list[index][name] = value;
            setDesc(list);
    };
    
    const handleDescRemove = (index) => {
            const list = [...desc];
            list.splice(index, 1);
            setDesc(list);
    };
    
    const handleDescAdd = () => {
            setDesc([...desc, {explain : ''}]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        data.category = [...new Set(categories)];
        data.desc = desc;
        data.ingredients =ingredient;
        const newPost = {
            userId: user._id,
            explain: data.explain,
            name: data.name,
            desc: data.desc,
            ingredients: data.ingredients,
            readytime: data.readytime,
            category: data.category,
            vegan: vegan,
            rating: data.rating,
            comments: data.comments,
            people: data.people
        }
        if (post) {
            dispatch(updatePost(post._id, newPost));
        } else {
            if (file) {
                let fileName = [];
                file.map(async (f) => {
                    const data = new FormData();
                    fileName.push(Date.now() + f.name);
                    data.append("name", Date.now() + f.name);
                    data.append("file", f);
                    try {
                      await axios.post("/upload", data);
                    } catch (err) {
                        console.log("Picture Upload failed : ", err);
                    }
                })
                newPost.img = fileName;
              }
            dispatch(createPost(newPost, navigate, user._id));
        }
    }

    const handleVegan = (e) => {
        setVegan(e.target.value);
    }

    const setImages = (e) => {
        const images = e.target.files;
        for (let i = 0; i < 4; i++) {
            if (!images[i]) {
                break;
            }
            setFile(prev => [...prev, images[i]]);
        }
    }

    const removeImage = (name) => {
        setFile(prev => prev.filter(f => (f.name !== name)));
    }


  return (
    <>
      <Topbar />
      <div className='shareContainer'>
        <Sidebar noCategory={true}/>
        <div className="share">
            <div className="shareWrapper">
                <div className="shareLeft">
                <form className='shareBox' onSubmit={(e) => handleSubmit(e)}>
                    <fieldset>
                        <legend>نام غذا *</legend>  
                        <input 
                        type="text"
                        className="shareInput"
                        value={data.name}
                        onChange={(e) =>setData({...data, name: e.target.value})}
                        required
                        />
                    </fieldset>
                    <fieldset>
                        <legend>توضیحات (شرح مختصر)</legend>  
                        <input 
                        type="text"
                        className="shareInput"
                        value={data.explain}
                        onChange={(e) =>setData({...data, explain: e.target.value})}
                        />
                    </fieldset>
                    <fieldset>
                        <legend> مواد اولیه و مقدار آن *</legend>
                        {ingredient.map((x, i) => (
                            <div className="box">
                                <input
                                name="name"
                                className="shareInput"
                                placeholder="نام ماده اولیه"
                                value={x.name}
                                onChange={e => handleIngredientChange(e, i)}
                                required
                                />
                                <input
                                className="shareInput"
                                name="amount"
                                placeholder="مقدار"
                                value={x.amount}
                                onChange={e => handleIngredientChange(e, i)}
                                required
                                />
                                <input
                                className="shareInput"
                                name="type"
                                placeholder="واحد"
                                value={x.type}
                                onChange={e => handleIngredientChange(e, i)}
                                />
                                <div className="btnBox">
                                {ingredient.length !== 1 && <button
                                    className="removeIcon"
                                    onClick={() => handleIngredientRemove(i)}><RemoveIcon /></button>}
                                {ingredient.length - 1 === i && <button className="addIcon" onClick={(e) => handleIngredientAdd(e)}><AddIcon /></button>}
                                </div>
                            </div>    
                        ))}
                    </fieldset>
                    <div className='timePeople'>
                    <fieldset>
                        <legend>مدت زمان آماده سازی (به دقیقه) *</legend>
                        <input 
                            type="number" 
                            min="0" 
                            className="shareInput readyTime" 
                            value={data.readytime}
                            onChange={(e) =>setData({...data, readytime: e.target.value})}
                            required/>
                    </fieldset>
                    <fieldset>
                        <legend>تعداد نفرات</legend>
                        <input 
                            type="number" 
                            min="1" 
                            className="shareInput readyTime" 
                            value={data.people}
                            onChange={(e) =>setData({...data, people: e.target.value})}
                            required/>
                    </fieldset>
                    </div>
                    <fieldset>
                        <legend>شرح مراحل آماده سازی *</legend>
                        {desc.map((x, i) => (
                            <div className="box">
                                <input
                                name="name"
                                className="shareInput"
                                placeholder={`مرحله ${i+1}`}
                                value={x.name}
                                onChange={e => handleDescChange(e, i)}
                                required
                                />
                                <div className="btnBox">
                                {desc.length !== 1 && <button
                                     className="removeIcon"
                                    onClick={() => handleDescRemove(i)}><RemoveIcon/></button>}
                                {desc.length - 1 === i && <button className="addIcon" onClick={(e) => handleDescAdd(e)}><AddIcon /></button>}
                                </div>
                            </div>    
                        ))}
                    </fieldset>
                    <fieldset>
                        <legend>دسته بندی</legend>
                        <div class="categoryContainer">
                            <a class="button" href="#popup">انتخاب کنید</a>
                            <div className="chosenCategory">
                                {categories.map(cat => (
                                    <div className="categoryTextBox">
                                        <span className="categoryTextItem">{cat}</span>
                                    </div>
                                ))}
                            </div>
                            <div class="popup" id="popup">
                                <div class="popup-inner">
                                {FoodCategory.map((cat) => (
                                    <Category name={cat.name} value={cat.value} categories={categories} setCategories={setCategories} />
                                ))}
                                <a class="closepopup" href="#">X</a>
                                </div>
                            </div>
                            </div>
                    </fieldset>
                    <fieldset className="shareVegan">
                        <legend>گیاهی</legend>
                        <input type="radio" id="vegan" name="vegan" 
                            className="veganInput isVegan" 
                            defaultChecked={post?.vegan ? true : false}
                            value={true}
                            onChange={(e) => handleVegan(e)}/>
                        <label for="vegan" className="foodCat">گیاهی هست</label>
                        <input type="radio" id="vegan" name="vegan" 
                            className="veganInput" 
                            defaultChecked={post?.vegan ? false : true}
                            value={false}
                            onChange={(e) => handleVegan(e)}/>
                        <label for="vegan" className="foodCat">گیاهی نیست</label>
                    </fieldset>
                    {!post && 
                        <fieldset className="shareImgBox">
                        <legend>بارگذاری تصویر *</legend>
                        <input 
                        type="file" 
                        id="file"
                        className='fileField'
                        accept=".png,.jpeg,.jpg" 
                        onChange={(e) => setImages(e)} 
                        multiple
                        required/>
                        </fieldset>
                    }
                    {!post && <button className='shareButton' type="submit">بارگذاری دستورپخت</button>}
                    {post && <button className='shareButton' type="submit">به روز رسانی دستورپخت</button>}
                </form>
                <hr className="shareHr" />
                {file && (
                <div className="previewImgContainer">
                    {file.map(f => (
                        <div className="imageBox">
                            <img className="previewImg" src={URL.createObjectURL(f)} alt="uploaded pic" />
                            <CancelIcon className="shareCancelImg" onClick={() => removeImage(f.name)} />
                        </div>
                    ))}

                </div>
                )}
            </div>
        </div>
      </div>
      </div>
    </>
  )
}

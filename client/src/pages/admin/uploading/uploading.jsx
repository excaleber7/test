import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

import fetchFn from "../../../utils/fetchFn";
import { dialogContext } from "../../../context/dialogContext";

import "./uploading.css";
import Loading from "../../../components/loading/loading";

function Uploading() {

   const showDialog = useContext(dialogContext);

   const { isLoading, mutate } = useMutation({
      mutationFn: async(body) => {
         const res = await fetch("/api/admin/item/add", {
            method: "POST",
            headers: {
               "Authorization": `Bearer ${localStorage.getItem("ssID")}`,
            
            },
            body
         });
         if (!res.ok) {
            const body = await res.json();
            throw new Error(body.message);
         }
         return res.json();
      },
      onError: (error) => showDialog(`${error}. Please try again.`),
      onSuccess: (data) => {
         localStorage.setItem("ssID", data.sessionToken);
         showDialog("Item added");
         setFormData({
            name: "",
            price: "",
            section: "men",
            type: "jeans",
            details: [],
         });
         setFiles([]);
         setAddedColors([{
            color: "red",
            sizes: [
               { size: "XS", stock: 0 },
            ],
         }]);
      },
   });

   const navigate = useNavigate();

   useQuery(
      ["admin_check"],
      () => fetchFn("/admin/check", "GET", localStorage.getItem("ssID")),
      {
         onSuccess: (data) => {
            if (!data.roles.includes("uploading")) {
               navigate("/");
               return;
            }
            localStorage.setItem("ssID", data.sessionToken);
         },
         onError: () =>  navigate("/"),
      }
   );

   const [addedColors, setAddedColors] = useState([{
      color: "red",
      sizes: [
         { size: "XS", stock: 0 },
      ],
   }]);
   
   const [formData, setFormData] = useState({
      name: "",
      price: "",
      section: "men",
      type: "jeans",
      details: [],
   });
   const [files, setFiles] = useState([]);

   function handleTextChange(e) {
      let { name, value } = e.target;
      if (name === "price") {
         value = Number(value);
      }
      setFormData(p => ({ ...p, [name]: value }));
   }

   function handleColorChange(e, i) {
      const colors = [...addedColors];
      colors[i].color = e.target.value;
      setAddedColors(colors);
   } 
   
   function handleSizeAndStockChange(e, colorI, sizeI) {
      const updatedColors = [...addedColors];

      const sizes = [...updatedColors[colorI].sizes];
      sizes[sizeI][e.target.name] = e.target.value;

      updatedColors[colorI].sizes = sizes;

      setAddedColors(updatedColors);
   }

   
   function handleFileChange(e) {
      setFiles(e.target.files);
   }

   //! ******** ADD and REMOVE COLORS or SIZE ********
   
   function handleAddColor() {
      setAddedColors(p => ([
         ...p, {
         color: "red",
         sizes: [
            { size: "XS", stock: 0 },
         ],
      }]));
   }
   
   function handleRemoveColor() {
      const color = [...addedColors];
      color.pop();
      setAddedColors(color);
   }

   function handleAddSize(i) {
      const updatedColors = [...addedColors];

      const sizes = [...updatedColors[i].sizes];
      sizes.push({ size: 'XS', stock: 0 });

      updatedColors[i].sizes = sizes;

      setAddedColors(updatedColors);
   }

   function handleRemoveSize(i) {
      const updatedColors = [...addedColors];
    
      const sizes = [...updatedColors[i].sizes];
      sizes.pop();

      updatedColors[i].sizes = sizes;

      setAddedColors(updatedColors);
   }

   //! ********* END ADD and REMOVE COLORS or SIZE **********


   //! ******** SEND TO SERVER ***********
   function handleSubmit(e) {
      e.preventDefault();
      const bodyData = new FormData();
      for (let i = 0; i < files.length; i++) {
         bodyData.append("images", files[i]);
      }
      const newFormData = { ...formData, details: addedColors }
      bodyData.append("json", JSON.stringify(newFormData));
      console.log(newFormData)

      mutate(bodyData);
   }
   //! ********** END SEND TO SERVER **************


   return <div className="cart-container">
      <div className="logo-container">
         <img className="img" src="/icons/asr-logo.svg" alt="ASR Logo" />
      </div>
      <h1>Upload</h1>
      <div>
         <form onSubmit={handleSubmit} >
            <label htmlFor="name">Name: </label>
            <input
               type="text"
               name="name"
               value={formData.name}
               onChange={handleTextChange}
               required
            /><br />
            <label htmlFor="price">Price: </label>
            <input
               type="text"
               name="price"
               value={formData.price}
               onChange={handleTextChange}
               required
            /><br />
            <label htmlFor="section">Section: </label>
            <select name="section" value={formData.section} onChange={handleTextChange} required>
               <option value="men">men</option>
               <option value="women">women</option>
               <option value="kids">kids</option>
            </select>
            <br />
            <label htmlFor="type">Type: </label>
            <select name="type" value={formData.type} onChange={handleTextChange} required>
               <option value="jeans">jeans</option>
               <option value="shirts">shirts</option>
               <option value="coats">coats</option>
               {
                  formData.section !== "men" && <>
                     <option value="dresses">dresses</option>
                     <option value="skirts">skirts</option>
                  </>
               }
            </select>
            <br />
            <div id="repeated" >
               {
                  addedColors.map( (obj, i) => <div key={i} style={{ padding: ".5rem", border: "1px solid black" }}>
                     <label htmlFor="color">Color: </label>
                     <select name="color" onChange={(e) => handleColorChange(e, i)} required>
                        <option value="red">red</option>
                        <option value="blue">blue</option>
                        <option value="yellow">yellow</option>
                        <option value="green">green</option>
                        <option value="black">black</option>
                        <option value="white">white</option>
                     </select>
                     {
                        addedColors[i].sizes.map((sizeObj, sizeI) => <div key={sizeI}>
                           <label htmlFor="size">Size: </label>
                           <select name="size" onChange={(e) => handleSizeAndStockChange(e, i, sizeI)} required>
                              <option value="XS">XS</option>
                              <option value="S">S</option>
                              <option value="L">L</option>
                              <option value="XL">XL</option>
                              <option value="XXL">XXL</option>
                              <option value="XXXL">XXXL</option>
                           </select>
                           <label htmlFor="stock">Stock for this size: </label>
                           <input
                              type="number"
                              name="stock"
                              value={addedColors[i].sizes[sizeI].stock}
                              onChange={(e) => handleSizeAndStockChange(e, i, sizeI)}
                              required
                           />
                        </div>)
                     }
                     <button type="button" onClick={() => handleAddSize(i)}>Add Size</button>
                     <button type="button" onClick={() => handleRemoveSize(i)}>Remove Size</button>
                  </div>)
               }
            </div>
            <button type="button" onClick={handleAddColor}>Add Color</button>
            <button type="button" onClick={handleRemoveColor}>Remove Color</button>
            <input
               type="file"
               name="images"
               accept="image/png, image/jpeg"
               multiple
               required
               onChange={handleFileChange}
            />
            <button type="submit">Submit</button>
         </form>
      </div>
      {isLoading && <Loading />}
   </div>;
}

export default Uploading;
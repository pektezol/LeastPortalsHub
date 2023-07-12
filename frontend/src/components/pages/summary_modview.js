import React from 'react';
import { useLocation }  from "react-router-dom";
import ReactMarkdown from 'react-markdown'

import "./summary_modview.css";


export default function Modview(prop) {
const {selectedRun,data,token} = prop

const [menu,setMenu] = React.useState(0)
React.useEffect(()=>{
if(menu===3){ // add
    document.querySelector("#modview-route-name>input").value=""
    document.querySelector("#modview-route-score>input").value=""
    document.querySelector("#modview-route-date>input").value=""
    document.querySelector("#modview-route-showcase>input").value=""
    document.querySelector("#modview-route-description>textarea").value=""
    }
if(menu===2){ // edit
    document.querySelector("#modview-route-id>input").value=data.summary.routes[selectedRun].route_id
    document.querySelector("#modview-route-name>input").value=data.summary.routes[selectedRun].history.runner_name
    document.querySelector("#modview-route-score>input").value=data.summary.routes[selectedRun].history.score_count
    document.querySelector("#modview-route-date>input").value=data.summary.routes[selectedRun].history.date.split("T")[0]
    document.querySelector("#modview-route-showcase>input").value=data.summary.routes[selectedRun].showcase
    document.querySelector("#modview-route-description>textarea").value=data.summary.routes[selectedRun].description
}   // eslint-disable-next-line 
},[menu])

function compressImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise(resolve => {
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          let {width, height} = img;
          if (width > 550) {
            height *= 550 / width;
            width = 550;
          }
          if (height > 320) {
            width *= 320 / height;
            height = 320;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(file.type, 0.6));
        };
      };
    });
}
const [image,setImage] = React.useState(null)
function uploadImage(){
    if(window.confirm("Are you sure you want to submit this to the database?")){
    fetch(`/api/v1/maps/${location.pathname.split('/')[2]}/image`,{
        method: 'PUT',
        headers: {Authorization: token},
        body: JSON.stringify({"image": image})
    }).then(r=>window.location.reload())
    }
}
const location = useLocation()
function editRoute(){
if(window.confirm("Are you sure you want to submit this to the database?")){
    let payload = {
        "description": document.querySelector("#modview-route-description>textarea").value===""?"No description available.":document.querySelector("#modview-route-description>textarea").value,
        "record_date": document.querySelector("#modview-route-date>input").value+"T00:00:00Z",
        "route_id": parseInt(document.querySelector("#modview-route-id>input").value),
        "score_count": parseInt(document.querySelector("#modview-route-score>input").value),
        "showcase": document.querySelector("#modview-route-showcase>input").value,
        "user_name": document.querySelector("#modview-route-name>input").value
      }
      fetch(`/api/v1/maps/${location.pathname.split('/')[2]}/summary`,{
        method: 'PUT',
        headers: {Authorization: token},
        body: JSON.stringify(payload)
      }).then(r=>window.location.reload())
    }
}


function addRoute(){
    if(window.confirm("Are you sure you want to submit this to the database?")){
    let payload = {
        "category_id": parseInt(document.querySelector("#modview-route-category>select").value),
        "description": document.querySelector("#modview-route-description>textarea").value===""?"No description available.":document.querySelector("#modview-route-description>textarea").value,
        "record_date": document.querySelector("#modview-route-date>input").value+"T00:00:00Z",
        "score_count": parseInt(document.querySelector("#modview-route-score>input").value),
        "showcase": document.querySelector("#modview-route-showcase>input").value,
        "user_name": document.querySelector("#modview-route-name>input").value
      }
      fetch(`/api/v1/maps/${location.pathname.split('/')[2]}/summary`,{
        method: 'POST',
        headers: {Authorization: token},
        body: JSON.stringify(payload)
        }).then(r=>window.location.reload())
    }
}

function deleteRoute(){
if(data.summary.routes[0].category==='')
{window.alert("no run selected")}else{
if(window.confirm(`Are you sure you want to delete this run from the database?
${data.summary.routes[selectedRun].category.name}    ${data.summary.routes[selectedRun].history.score_count} portals    ${data.summary.routes[selectedRun].history.runner_name}`)===true){
    console.log("deleted:",selectedRun)
    fetch(`/api/v1/maps/${location.pathname.split('/')[2]}/summary`,{
        method: 'DELETE',
        headers: {Authorization: token},
        body: JSON.stringify({"route_id":data.summary.routes[selectedRun].route_id})
      }).then(r=>window.location.reload())
}}

}

const [showButton, setShowButton] = React.useState(1)
const modview = document.querySelector("div#modview")
React.useEffect(()=>{
    if(modview!==null){
        showButton ? modview.style.transform="translateY(-68%)"
        : modview.style.transform="translateY(0%)"
    }
    let modview_block = document.querySelector("#modview_block")
    showButton===1?modview_block.style.display="none":modview_block.style.display="block"// eslint-disable-next-line 
},[showButton])

const [md,setMd] = React.useState("")

return (
    <>
    <div id="modview_block"></div>
        <div id='modview'>
            <div>
                <button onClick={()=>setMenu(1)}>edit image</button>
                <button onClick={            
                data.summary.routes[0].category===''?()=>window.alert("no run selected"):()=>setMenu(2)}>edit selected route</button>
                <button onClick={()=>setMenu(3)}>add new route</button>
                <button onClick={()=>deleteRoute()}>delete selected route</button>
            </div>
            <div>
                 {showButton ?(
                    <button onClick={()=>setShowButton(0)}>Show</button>
                ) : (
                    <button onClick={()=>{setShowButton(1);setMenu(0)}}>Hide</button>
                )} 
            </div>
        </div>
        {menu!==0? (
        <div id='modview-menu'>
        {menu===1? ( 
            // image
            <div id='modview-menu-image'>
                <div>
                    <span>current image:</span>
                    <img src={data.map.image} alt="missing" />
                </div>

                <div>
                    <span>new image:
                    <input type="file" accept='image/*' onChange={e=>
                            compressImage(e.target.files[0])
                            .then(d=>setImage(d))
                    }/></span>
                    {image!==null?(<button onClick={()=>uploadImage()}>upload</button>):<span></span>}
                    <img src={image} alt="" id='modview-menu-image-file'/>
                    
                </div>
            </div>
        ):menu===2?(
            // edit route
            <div id='modview-menu-edit'>
                <div id='modview-route-id'>
                    <span>route id:</span>
                    <input type="number"  disabled/>
                </div>
                <div id='modview-route-name'>
                    <span>runner name:</span>
                    <input type="text"/>
                </div>
                <div id='modview-route-score'>
                    <span>score:</span>
                    <input type="number"/>
                </div>
                <div id='modview-route-date'>
                    <span>date:</span>
                    <input type="date"/>
                </div>
                <div id='modview-route-showcase'>
                    <span>showcase video:</span>
                    <input type="text"/>
                </div>
                <div id='modview-route-description' style={{height:"180px",gridColumn:"1 / span 5"}}>
                    <span>description:</span>
                    <textarea onChange={()=>setMd(document.querySelector("#modview-route-description>textarea").value)}></textarea>
                </div>
                <button style={{gridColumn:"2 / span 3",height:"40px"}} onClick={editRoute}>Apply</button>
            </div>
        ):menu===3?(
            // add route
            <div id='modview-menu-add'>
                <div id='modview-route-category'>
                    <span>category:</span>
                    <select>
                        <option value="1" key="1">CM</option>
                        <option value="2" key="2">No SLA</option>
                        {data.map.game_name==="Portal 2 - Cooperative"?"":(
                        <option value="3" key="3">Inbounds SLA</option>)}
                        <option value="4" key="4">Any%</option>
                    </select>
                </div>
                <div id='modview-route-name'>
                    <span>runner name:</span>
                    <input type="text" />
                </div>
                <div id='modview-route-score'>
                    <span>score:</span>
                    <input type="number" />
                </div>
                <div id='modview-route-date'>
                    <span>date:</span>
                    <input type="date" />
                </div>
                <div id='modview-route-showcase'>
                    <span>showcase video:</span>
                    <input type="text" />
                </div>
                <div id='modview-route-description' style={{height:"180px",gridColumn:"1 / span 5"}}>
                    <span>description:</span>
                    <textarea defaultValue={"No description available."} onChange={()=>setMd(document.querySelector("#modview-route-description>textarea").value)}></textarea>
                </div>
                <button style={{gridColumn:"2 / span 3",height:"40px"}} onClick={addRoute}>Apply</button>
            </div>
        ):("error")}

            {menu!==1?(
            <div id='modview-md'>
                <span>Markdown preview</span> 
                <span><a href="https://commonmark.org/help/" rel="noreferrer" target='_blank'>documentation</a></span> 
                <span><a href="https://remarkjs.github.io/react-markdown/" rel="noreferrer" target='_blank'>demo</a></span> 
                    <p>
                    <ReactMarkdown>{md}
                    </ReactMarkdown>
                    </p>
            </div>
            ):""}
        </div>):""}
        
    </>
)
}


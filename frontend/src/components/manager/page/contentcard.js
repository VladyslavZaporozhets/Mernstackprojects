import React,{useState, useMemo, useEffect} from 'react'
import { AdminCard } from '../../shared'
import {Content,FileContainter} from './styles'
import { Button } from '../../../styles'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw ,ContentState,convertFromHTML } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { toast } from 'react-toastify';
import { useApi } from './/../../../contexts/ApiContext'

export const ContentCard = (props)=>{
const {title,name} = props
let content = require('./content.json');
const [{doPost}] = useApi()
// const onSubmit = async(data) => {
//     const formData = new FormData();
//     formData.append("files", data.file[0]);
//     formData.append("name", name);
//     const url = process.env.REACT_APP_SERVER_URL + 'fileservice/upload';
 
//     const res = await fetch(url, {
//         method: "POST",
//         body: formData 
//     }).then((res) => {
//         if(res.data == "failed" || res.error){
//             toast("Server Error",{type:'error'})
//         }
//         else{
//             toast.success("Success",{
//                 onClose:()=>{
//                     window.location.reload(false)
//                 },
//                 autoClose : 3000
//             })
//         }
//     });

// }

///////////////Edit Text //////////////////

const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const handleChange = (data) => {
    setEditorState(data);
  };
  var htmlData = useMemo(
    () => draftToHtml(convertToRaw(editorState.getCurrentContent())),
    [editorState]
  );

const toolbarOptions = {
    options: ["inline", "fontSize", "image", "emoji"],
    inline: {
      options: ["bold", "italic", "underline", "strikethrough"],
    },
  };

const onSaveContent = async() => {
    content[name] = htmlData;
    const url = 'fileservice/writeContent';
 
    const response = await doPost(url, {
        name     : name, 
        htmlData : htmlData
    })
    
    if(response.error || response.result == 'failed'){
        toast('Server Error',{type:'error'})
        return;
    }
    else{
        toast.success("Success",{
            onClose:()=>{
                window.location.reload(false)
            },
            autoClose : 3000
        })
    }
}

useEffect(()=>{
    fetch(process.env.REACT_APP_SERVER_URL + 'fileservice/readContent')
        .then((response) => response.json())
        .then((data) => {
        if(data.status > 200){
            toast(data.msg,{type:'error'})
            return;
        } else {
            content = data.result;
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(content[name]))));
        }
        })
        .catch((err) => {
        console.log(err.message);
        });
}, [])

return(
    <AdminCard title = {title}>
    <h2 style = {{textAlign:'center',marginBottom:5}}> {title} </h2>
    <Content>
        <Editor
            editorStyle={{height:"200px", overflow: "auto", padding:'10px 20px'}}
            wrapperStyle={{ width: 800, border: "1px solid black"}}
            editorState={editorState}
            onEditorStateChange={handleChange}
            wrapperClassName="editor-wrapper"
            editorClassName="message-editor"
            toolbarClassName="message-toolbar"
            toolbar={toolbarOptions}
            
        />
        <div className="html-output" style={{display:'none'}}>{htmlData}</div>
    </Content>
    <div style={{ textAlign: "-webkit-center", marginTop:"10px"}}>
        <Button onClick={onSaveContent} color="primary" style = {{marginLeft:"30%"}}>Save</Button> 
    </div>
</AdminCard>
)
}
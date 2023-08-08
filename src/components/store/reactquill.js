import React, { useEffect, useState } from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
/* 추가된 코드  퀼 이미지 사이즈 조정*/
import ImageResize from 'quill-image-resize';
Quill.register('modules/ImageResize', ImageResize);



const Editor2 = (props) => {

  // const [content, setContent] =useState('');
  const [content, setContent] = useState(props.value || ''); // 초기값으로 props.value 또는 빈 문자열 사용

  // props.value 값이 변경되었을 때 content 상태 업데이트
  useEffect(() => {
    setContent(props.value || '');
  }, [props.value]);


  const handleContentChange = (content, delta, source) => {  
    
    setContent(content);    // content값 넣어주기
    props.onChange(content);
  };
  
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, {'font': []}],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'},
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],

    /* 추가된 코드 */
    ImageResize: {
      parchment: Quill.import('parchment')
    }
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return (
    <div>      
      <ReactQuill
        value={content}
        name="content" 
        onChange={handleContentChange}
        modules={modules}
        formats={formats}
        style={{ width: '100%' }}
        placeholder="내용을 입력하세요"
      />

    {/* <div dangerouslySetInnerHTML={{ __html :  content  }} /> */}
    </div>
  );
};

export default Editor2;
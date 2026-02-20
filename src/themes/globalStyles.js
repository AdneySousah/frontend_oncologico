import { createGlobalStyle } from "styled-components";
import 'react-toastify/dist/ReactToastify.css'
import 'animate.css';



export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body{
        font-family: 'Inter', sans-serif;
        font-size: 18px;
        font-weight: 300;
    }

`

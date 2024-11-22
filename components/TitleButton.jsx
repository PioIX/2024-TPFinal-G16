"use client"
import styles from '../components/TitleButton.module.css'


export default function TitleButton({ className, text, onClick }) {

    return(
        <button className= {className}
       onClick = {onClick}>
        {text}
       </button>
    )
}
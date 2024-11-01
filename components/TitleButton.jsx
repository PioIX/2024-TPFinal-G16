"use client"
import styles from '../components/TitleButton.module.css'


export default function TitleButton({ text, onClick }) {

    return(
        <button className= {styles.TitleButton}
       onClick = {onClick}>
        {text}
       </button>
    )
}
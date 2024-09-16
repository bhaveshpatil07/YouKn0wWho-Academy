import styles from "../styles/loader.module.css"

export default function Loader({ show ="" }) {
    return (
        <div className={styles.loaderContainer}>
            <span className={styles.loader}>{show}</span>
        </div>
    )
}
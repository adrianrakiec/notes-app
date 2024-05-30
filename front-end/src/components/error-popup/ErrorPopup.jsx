import styles from './ErrorPopup.module.css';

export const ErrorPopup = ({children}) => {
    return (
        <div className={styles.popup}>
            {children}
        </div>
    )
}
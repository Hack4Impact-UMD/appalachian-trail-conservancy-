import styles from "./TrainingCard.module.css";
import LinearProgressWithLabel from "../LinearProgressWithLabel/LinearProgressWithLabel";

interface TrainingCardProps {
  image: string;
  title: string;
  progress?: number; // Optional progress value
  setOpenTrainingPopup: any; // Close popup function
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  image,
  title,
  progress,
  setOpenTrainingPopup,
}) => {
  const renderMarker = () => {
    if (progress === undefined || progress === 0) {
      // Training not started
      return (
        <div className={`${styles.marker} ${styles.notStartedMarker}`}>
          NOT STARTED
        </div>
      );
    } else if (progress === 100) {
      // Training completed
      return (
        <div className={`${styles.marker} ${styles.completedMarker}`}>
          COMPLETED
        </div>
      );
    } else {
      // Training in progress
      return <LinearProgressWithLabel value={progress} />;
    }
  };

  return (
    <div
      className={styles.trainingCard}
      onClick={() => setOpenTrainingPopup(true)}>
      <div className={styles.trainingImage}>
        <img src={image} alt="Training" />
      </div>
      <div className={styles.trainingContent}>
        <div className={styles.trainingTitle}>{title}</div>
        <div className={styles.progressBar}>{renderMarker()}</div>
      </div>
    </div>
  );
};

export default TrainingCard;

import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Link } from "react-router-dom";
import { getVolunteer, getAllTrainings, getAllPathways } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { PathwayID } from "../../types/PathwayType";
import { VolunteerTraining, VolunteerPathway } from "../../types/UserType";
import TrainingCard from "../../components/TrainingCard/TrainingCard";
import PathwayCard from "../../components/PathwayCard/PathwayCard";
import styles from "./DashboardPage.module.css";
import Certificate from "../../components/CertificateCard/CertificateCard";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Loading from "../../components/LoadingScreen/Loading";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";
import badge from "../../assets/badge.svg";

function Dashboard() {
  const auth = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [correlatedTrainings, setCorrelatedTrainings] = useState<
    { genericTraining: TrainingID; volunteerTraining?: VolunteerTraining }[]
  >([]);
  const [trainingsInProgress, setTrainingsInProgress] = useState<
    { genericTraining: TrainingID; volunteerTraining: VolunteerTraining }[]
  >([]);
  const [trainingsCompleted, setTrainingsCompleted] = useState<
    { genericTraining: TrainingID; volunteerTraining: VolunteerTraining }[]
  >([]);
  const [correlatedPathways, setCorrelatedPathways] = useState<
    { genericPathway: PathwayID; volunteerPathway?: VolunteerPathway }[]
  >([]);
  const [pathwaysInProgress, setPathwaysInProgress] = useState<
    { genericPathway: PathwayID; volunteerPathway: VolunteerPathway }[]
  >([]);
  const [pathwaysCompleted, setPathwaysCompleted] = useState<
    { genericPathway: PathwayID; volunteerPathway: VolunteerPathway }[]
  >([]);

  const correlateTrainings = (
    genericTrainings: TrainingID[] ,
    volunteerTrainings: VolunteerTraining[] 
  ) => {

    // match up the allGenericTrainings and volunteerTrainings, use setCorrelatedTrainings to set
    let allCorrelatedTrainings: {
      genericTraining: TrainingID;
      volunteerTraining?: VolunteerTraining;
    }[] = [];

    let trainingsIP: {
      genericTraining: TrainingID;
      volunteerTraining: VolunteerTraining;
    }[] = [];

    let trainingsC: {
      genericTraining: TrainingID;
      volunteerTraining: VolunteerTraining;
    }[] = [];

    for (const genericTraining of genericTrainings) {
      // if genericTraining in volunteer.trainingInformation (has been started by volunteer), then we include that.
      let startedByVolunteer = false;
      for (const volunteerTraining of volunteerTrainings) {
        if (genericTraining.id == volunteerTraining.trainingID) {
          startedByVolunteer = true;
          allCorrelatedTrainings.push({
            genericTraining: genericTraining,
            volunteerTraining: volunteerTraining,
          });
          if (volunteerTraining.progress == "INPROGRESS") {
            trainingsIP.push({
              genericTraining: genericTraining,
              volunteerTraining: volunteerTraining,
            });
          }
          else if (volunteerTraining.progress == "COMPLETED") {
            trainingsC.push({
              genericTraining: genericTraining,
              volunteerTraining: volunteerTraining,
            });
          }
        }
      }
      if (!startedByVolunteer) {
        allCorrelatedTrainings.push({
          genericTraining: genericTraining,
          volunteerTraining: undefined,
        });
      }
    }
    trainingsC = sortTrainingsByDateCompleted(trainingsC);
    setCorrelatedTrainings(allCorrelatedTrainings);
    setTrainingsInProgress(trainingsIP);
    setTrainingsCompleted(trainingsC);
  };

  const correlatePathways = (
    genericPathways: PathwayID[] ,
    volunteerPathways: VolunteerPathway[] 
  ) => {
    // match up the genericPathways and volunteerPathways
    let allCorrelatedPathways: {
      genericPathway: PathwayID;
      volunteerPathway?: VolunteerPathway;
    }[] = [];

    let pathwaysIP: {
      genericPathway: PathwayID;
      volunteerPathway: VolunteerPathway;
    }[] = [];

    let pathwaysC: {
      genericPathway: PathwayID;
      volunteerPathway: VolunteerPathway;
    }[] = [];

    for (const genericPathway of genericPathways) {
      let startedByVolunteer = false;
      for (const volunteerPathway of volunteerPathways) {
        if (genericPathway.id == volunteerPathway.pathwayID) {
          startedByVolunteer = true;
          allCorrelatedPathways.push({
            genericPathway: genericPathway,
            volunteerPathway: volunteerPathway,
          });
          if (volunteerPathway.progress == "INPROGRESS") {
            pathwaysIP.push({
              genericPathway: genericPathway,
              volunteerPathway: volunteerPathway,
            });
          }
          else if (volunteerPathway.progress == "COMPLETED") {
            pathwaysC.push({
              genericPathway: genericPathway,
              volunteerPathway: volunteerPathway,
            });
          }
        }
      }
      if (!startedByVolunteer) {
        allCorrelatedPathways.push({
          genericPathway: genericPathway,
          volunteerPathway: undefined,
        });
      }
    }
    pathwaysC = sortPathwaysByDateCompleted(pathwaysC);
    setCorrelatedPathways(allCorrelatedPathways);
    setPathwaysInProgress(pathwaysIP);
    setPathwaysCompleted(pathwaysC);
  }

  function sortTrainingsByDateCompleted(trainings: {
    genericTraining: TrainingID;
    volunteerTraining: VolunteerTraining;
  }[]): {
    genericTraining: TrainingID;
    volunteerTraining: VolunteerTraining;
  }[] {
    return trainings.sort((a, b) => {
        const dateA = new Date(a.volunteerTraining.dateCompleted);
        const dateB = new Date(b.volunteerTraining.dateCompleted);
        return dateB.getTime() - dateA.getTime();
    });
  }

  function sortPathwaysByDateCompleted(pathways: {
    genericPathway: PathwayID;
    volunteerPathway: VolunteerPathway;
  }[]): {
    genericPathway: PathwayID;
    volunteerPathway: VolunteerPathway;
  }[] {
    return pathways.sort((a, b) => {
        const dateA = new Date(a.volunteerPathway.dateCompleted);
        const dateB = new Date(b.volunteerPathway.dateCompleted);
        return dateB.getTime() - dateA.getTime();
    });
  }

  useEffect(() => {

    // only use auth if it is finished loading
    if (!auth.loading && auth.id) {

      // get volunteer info from firebase. will contain volunteer progress on trainings & pathways
      getVolunteer(auth.id.toString())
        .then((volunteer) => {
          const volunteerTrainings = volunteer.trainingInformation;
          const volunteerPathways = volunteer.pathwayInformation;

          // get all trainings from firebase
          getAllTrainings()
          .then((genericTrainings) => {
            correlateTrainings(genericTrainings, volunteerTrainings);
          })
          .catch((error) => {
            console.error("Error fetching trainings:", error);
          });

          // get all pathways from firebase
          getAllPathways()
          .then((genericPathways) => {
            correlatePathways(genericPathways, volunteerPathways);
          })
          .catch((error) => {
            console.error("Error fetching pathways:", error);
          });

          setLoading(false);

        })
        .catch((error) => {
          console.error("Error fetching volunteer:", error);
        });
    }
  }, [auth.loading, auth.id]);

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />

      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Hello, {auth.firstName}!</h1>
              <ProfileIcon />
            </div>
            {loading ? (
              <Loading />
            ) : (
              <>
                {/* display pathways in progress if there exist pathways in progress */}
                { pathwaysInProgress.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Pathways in Progress</h2>
                      <Link className={styles.viewAllLink} to="/pathways">
                        VIEW ALL
                      </Link>
                    </div>
                    <div className={styles.cardsContainer}>
                      {pathwaysInProgress.slice(0, 2).map((pathway, index) => (
                        <div className={styles.card} key={index}>
                          <PathwayCard
                            image="../../"
                            title={pathway.genericPathway.name}
                            progress={pathway.volunteerPathway? 
                              pathway.volunteerPathway.numTrainingsCompleted / pathway.volunteerPathway.numTotalTrainings * 100
                              : 0}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* display trainings in progress if there exist trainings in progress */}
                { trainingsInProgress.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Trainings in Progress</h2>
                      <Link className={styles.viewAllLink} to="/trainings">
                        VIEW ALL
                      </Link>
                    </div>
                    <div className={styles.cardsContainer}>
                      {trainingsInProgress.slice(0, 3).map((training, index) => (
                        <div className={styles.card} key={index}>
                          <TrainingCard
                            training={training.genericTraining}
                            volunteerTraining={training.volunteerTraining}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* display badges if there exist pathways completed */}
                { pathwaysCompleted.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Recent Badges</h2>
                      <Link className={styles.viewAllLink} to="/achievements">
                        VIEW ALL
                      </Link>
                    </div>
                    <div className={styles.cardsContainer}>
                      {pathwaysCompleted.slice(0,4).map((pathway, index) => (
                        <div className={styles.card} key={index}>
                          <Certificate
                            image={pathway.genericPathway.badgeImage}
                            title={pathway.genericPathway.name}
                            date={pathway.volunteerPathway.dateCompleted}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* display certifications if there exist trainings completed */}
                { trainingsCompleted.length > 0 && (
                  <div>
                    <div className={styles.subHeader}>
                      <h2>Recent Certifications</h2>
                      <Link className={styles.viewAllLink} to="/achievements">
                        VIEW ALL
                      </Link>
                    </div>
                    <div className={styles.cardsContainer}>
                      {trainingsCompleted.slice(0,4).map((training, index) => (
                        <div className={styles.card} key={index}>
                          <Certificate
                            image={training.genericTraining.certificationImage}
                            title={training.genericTraining.name}
                            date={training.volunteerTraining.dateCompleted}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Dashboard;

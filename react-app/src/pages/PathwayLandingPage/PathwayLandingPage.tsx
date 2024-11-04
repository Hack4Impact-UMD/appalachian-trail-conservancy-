import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import TitleInfo from "./TitleInfo";
import styles from "./PathwayLandingPage.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import PathwayTile from "./PathwayTile";
import { VolunteerPathway } from "../../types/UserType";
import { PathwayID } from "../../types/PathwayType";
import { useAuth } from "../../auth/AuthProvider";
import Loading from "../../components/LoadingScreen/Loading";
import { getPathway, getTraining } from "../../backend/FirestoreCalls";
import { TrainingID } from "../../types/TrainingType";
import { useParams } from "react-router-dom";
import { WidthFull } from "@mui/icons-material";

const PathwayLandingPage: React.FC = () => {
  const auth = useAuth();
  const pathwayId = useParams().id;
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationBarOpen, setNavigationBarOpen] = useState<boolean>(true);
  const [divWidth, setDivWidth] = useState<number>(0);
  const [trainings, setTrainings] = useState<TrainingID[]>([]);
  const [elements, setElements] = useState<any[]>([]);

  const [pathway, setPathway] = useState<PathwayID>({
    name: "",
    id: "",
    shortBlurb: "",
    description: "",
    coverImage: "",
    trainingIDs: [],
    quiz: {
      questions: [],
      numQuestions: 0,
      passingScore: 0,
    },
    badgeImage: "",
  });

  const div = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getPathwayInfo = async () => {
      // get pathway if not coming from in app
      if (pathwayId !== undefined && !location.state?.pathway) {
        if (pathwayId !== undefined && !auth.loading && auth.id) {
          getPathway(pathwayId)
            .then(async (pathwayData) => {
              setPathway(pathwayData);
              console.log(pathwayData);
              const trainingPromises = pathwayData.trainingIDs.map(getTraining);
              const fetchedTrainings = await Promise.all(trainingPromises);
              console.log(fetchedTrainings);
              setTrainings(fetchedTrainings);
              renderGrid(fetchedTrainings);
            })
            .catch(() => {
              console.log("Failed to get pathway");
            });
        }
      } else {
        // set pathway from location state
        if (location.state.pathway) {
          setPathway(location.state.pathway);
          const trainingPromises =
            location.state.pathway.trainingIDs.map(getTraining);
          const fetchedTrainings = await Promise.all(trainingPromises);
          console.log(fetchedTrainings);
          setTrainings(fetchedTrainings);
          renderGrid(fetchedTrainings);
        }
      }
    };
    getPathwayInfo();
  }, [auth.loading, auth.id]);

  //console.log("Width " + divWidth + "\nlength " + trainings.length);
  useEffect(() => {
    // when the component gets mounted
    if (div.current) setDivWidth(div.current.offsetWidth);
    // to handle page resize
    const getwidth = () => {
      if (div.current) setDivWidth(div.current.offsetWidth);
    };
    window.addEventListener("resize", getwidth);
    // remove the event listener before the component gets unmounted
    return () => window.removeEventListener("resize", getwidth);
  }, [navigationBarOpen]);

  useEffect(() => {
    renderGrid(trainings);
    
  }, [divWidth, navigationBarOpen, pathway]);

  const renderGrid = (trainings: TrainingID[]) => {
    console.log("ran");
    const imgWidth = 300;
    const imagesPerRow = Math.floor(divWidth / imgWidth);
    // To prevent trainings.length from being used uninitialized
    const height =
      trainings.length == 0
        ? 0
        : Math.ceil((trainings.length + 1) / imagesPerRow);
    let count = 0;

    let newElts = [];

    for (let i = 0; i < height; i++) {
      if (i % 2 == 0) {
        for (let j = count; j < count + imagesPerRow; j++) {
          newElts.push(
            <div key={j}>
              <PathwayTile
                tileNum={j}
                trainingID={j < trainings.length ? trainings[j] : undefined}
                space={divWidth}
                count={trainings.length}
              />
            </div>
          );
        }
      }
      // Reverse
      else {
        for (let j = count + imagesPerRow - 1; j >= count; j--) {
          newElts.push(
            <div key={j}>
              <PathwayTile
                tileNum={j}
                trainingID={j < trainings.length ? trainings[j] : undefined}
                space={divWidth}
                count={trainings.length}
              />
            </div>
          );
        }
      }
      count += imagesPerRow;
    }
    setElements(newElts);

  };

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.pageContainer}>
          <div className={styles.content} ref={div}>
            <TitleInfo title={pathway.name} description={pathway.shortBlurb} />

            {/* Pathway Tiles Section */}
            <div className={styles.pathwayTiles}>
              {/* Render the Pathway tiles */}
              {/* {trainings.map((trainingData, index) => (
                <PathwayTile
                  tileNum={index + 1}
                  trainingID={trainingData}
                  space={divWidth}
                  count={trainings.length}
                />
              ))}{" "} */}
              {/* for loop + 1 */}
              {/* <PathwayTile
                tileNum={1}
                space={divWidth}
                count={trainings.length}
              /> */}
              {elements}
              {/* for loop - even row do 1 2 3, odd row do 6 4 5, etc  */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PathwayLandingPage;

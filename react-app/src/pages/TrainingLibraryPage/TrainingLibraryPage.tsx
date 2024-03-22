import styles from "./TrainingLibrary.module.css";
import { IoIosSearch } from "react-icons/io";
import { TextField, InputAdornment, Button } from "@mui/material";
import TrainingCard from "../../components/TrainingCard/Training";
import { useState } from "react";
import React from "react";
import debounce from "lodash.debounce";

const styledSearchBar = {
  border: "1.5px solid var(--blue-gray)",
  borderRadius: "10px",
  marginRight: "1%",
  width: "55%",
  height: 38,
  "& fieldset": { border: "none" },
};

const styledButton = {
  margin: "1%",
  marginTop: "0%",
  marginLeft: "0.5%",
  marginRight: "0%",
  height: 38,
"& fieldset": { border: "none" },
  paddingLeft: "2.5%",
  paddingRight: "2.5%",
  paddingTop: "1%",
  paddingBottom: "1%",
  borderRadius: "13px",
  whiteSpace: "nowrap",
};

function TrainingLibrary() {
  
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrainings, setFilteredTrainings] = useState<
    { title: string; subtitle: string; progress: number }[]
  >([]);

  const trainingCards = [
    { title: "Cat", subtitle: "Subtitle 1", progress: 23 },
    { title: "NotInProgress", subtitle: "Subtitle 2", progress: 0 },
    { title: "Complete", subtitle: "Subtitle 3", progress: 100 },
    { title: "Dog", subtitle: "Subtitle 4", progress: 10 },
    { title: "NotInProgress2", subtitle: "Subtitle 1", progress: 0 },
    { title: "Catfish", subtitle: "Subtitle 2", progress: 50 },
    { title: "C", subtitle: "Subtitle 3", progress: 76 },
    { title: "Cat", subtitle: "Subtitle 4", progress: 100 },
    { title: "Cat", subtitle: "Subtitle 1", progress: 23 },
    { title: "Catfish", subtitle: "Subtitle 2", progress: 50 },
    { title: "C", subtitle: "Subtitle 3", progress: 76 },
    { title: "Dog", subtitle: "Subtitle 4", progress: 10 },
    // Add more training card data as needed
  ];

  const filterTrainings = () => {
    let filtered = trainingCards;

    if (searchQuery) {
      filtered = filtered.filter(training =>
        training.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType === "inProgress") {
      filtered = filtered.filter(training => training.progress > 0 && training.progress < 100);
    } else if (filterType === "completed") {
      filtered = filtered.filter(training => training.progress === 100);
    }

    setFilteredTrainings(filtered);
  };

  React.useEffect(() => {
    filterTrainings();
  }, [searchQuery, filterType]);

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSearchQuery(e.target.value);

  const debouncedOnChange = debounce(updateQuery, 500);

  return (
    <>
      <div className={`${styles.split} ${styles.left}`}></div>
      <div className={`${styles.split} ${styles.right}`}>
        <div className={styles.header}>
          <h1 className={styles.nameHeading}> Trainings </h1>
          <div className={styles.imgContainer}>
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
          </div>
        </div>

        <div className={styles.searchBarContainer}>
          <TextField
            sx={styledSearchBar}
            variant="outlined"
            size="small"
            placeholder="Search..."
            onChange={debouncedOnChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoIosSearch />
                </InputAdornment>
              ),
            }}
          />
          <Button
          style={{ 
              backgroundColor: filterType === "all" ? "var(--forest-green)" : "white", 
              color: filterType === "all" ? "white" : "var(--blue-gray)" 
              }}
              sx={{
                  ...styledButton,
                  border: `1.5px solid ${filterType === "all" ? "var(--forest-green)" : "var(--blue-gray)"}`,
                  '&:hover': {
                      border: `1.5px solid ${filterType === "all" ? "var(--forest-green)" : "var(--blue-gray)"}`,
                  },
              }}
          onClick={() => setFilterType("all")}
          >
          All
          </Button>
          <Button
          style={{ 
              backgroundColor: filterType === "inProgress" ? "var(--forest-green)" : "white",
              color: filterType === "inProgress" ? "white" : "var(--blue-gray)" 
          }}
          sx={{
              ...styledButton,
              border: `1.5px solid ${filterType === "inProgress" ? "var(--forest-green)" : "var(--blue-gray)"}`,
              '&:hover': {
                  border: `1.5px solid ${filterType === "inProgress" ? "var(--forest-green)" : "var(--blue-gray)"}`,
              },
          }}
          onClick={() => setFilterType("inProgress")}
          >
          In Progress
          </Button>
          <Button
          style={{ 
              backgroundColor: filterType === "completed" ? "var(--forest-green)" : "white", 
              color: filterType === "completed" ? "white" : "var(--blue-gray)" 
          }}
          sx={{
              ...styledButton,
              border: `1.5px solid ${filterType === "completed" ? "var(--forest-green)" : "var(--blue-gray)"}`,
              '&:hover': {
                  border: `1.5px solid ${filterType === "completed" ? "var(--forest-green)" : "var(--blue-gray)"}`,
              },
          }}
          onClick={() => setFilterType("completed")}
          >
          Completed
          </Button>
        </div>

        <div className={styles.cardsContainer}>
          {filteredTrainings.map((training, index) => (
            <div className={styles.card} key={index}>
              <TrainingCard
                image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
                title={training.title}
                subtitle={training.subtitle}
                progress={training.progress}
              />
            </div>
          ))}
        </div>

        <div className={styles.subHeader}>
          <h2>Recommended</h2>
        </div>
        <div className={styles.cardsContainer}>
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
          />
          <TrainingCard
            image="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg"
            title="Title"
            subtitle="SUBTITLE"
          />
        </div>
      </div>
    </>
  );
}

export default TrainingLibrary;

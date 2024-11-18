import { useEffect, useState } from "react";
import styles from "./AdminUserManagement.module.css";
import { 
  getVolunteers,
  getAllTrainings,
  getAllPathways
 } from "../../backend/FirestoreCalls";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import { User } from "../../types/UserType.ts";
import { TrainingID } from "../../types/TrainingType.ts";
import { PathwayID } from "../../types/PathwayType.ts";
import {
  DataGrid,
  GridColumnMenuProps,
  GridColumnMenuContainer,
  GridFilterMenuItem,
  SortGridMenuItems,
} from "@mui/x-data-grid";
import { IoIosSearch } from "react-icons/io";
import { TbArrowsSort } from "react-icons/tb";
import {
  grayBorderSearchBar,
  CustomToggleButtonGroup,
  PurpleToggleButton,
  whiteButtonOceanGreenBorder,
  DataGridStyles,
} from "../../muiTheme";
import debounce from "lodash.debounce";
import hamburger from "../../assets/hamburger.svg";
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Footer from "../../components/Footer/Footer";

function AdminUserManagement() {
  const [alignment, setAlignment] = useState<string | null>("user");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [filteredTrainings, setFilteredTrainings] = useState<TrainingID[]>([]);
  const [trainingsData, setTrainingsData] = useState<TrainingID[]>([]);
  const [filteredPathways, setFilteredPathways] = useState<PathwayID[]>([]);
  const [pathwaysData, setPathwaysData] = useState<PathwayID[]>([]);
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  useEffect(() => {
    getVolunteers()
      .then((users) => {
        setUsersData(users);
        setFilteredUsers(users); // Initialize filteredUsers with all users from Firestore
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
      getAllTrainings()
      .then((trainings) => {
        setTrainingsData(trainings);
        setFilteredTrainings(trainings); 
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
      getAllPathways()
      .then((pathways) => {
        setPathwaysData(pathways);
        setFilteredPathways(pathways); 
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const usersColumns = [
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "misc", headerName: "Miscellaneous", width: 200 },
  ];

  const pathwaysColumns = [
    { field: "name", headerName: "Pathway Name", width: 350 },
  ];

  const trainingsColumns = [
    { field: "name", headerName: "Training Name", width: 350 },
  ];

  const filterUsers = () => {
    let filtered = searchQuery
      ? usersData.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : usersData; // Show all users if searchQuery is empty
    setFilteredUsers(filtered);
  };

  const CustomColumnMenu = (props: GridColumnMenuProps) => {
    const { hideMenu, currentColumn, open } = props;

    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        open={open}>
        <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
        <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
      </GridColumnMenuContainer>
    );
  };

  const updateQuery = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const debouncedOnChange = debounce(updateQuery, 200);

  useEffect(() => {
    filterUsers(); // Filter users whenever the searchQuery changes
  }, [searchQuery]);

  useEffect(() => {
    setFilteredUsers(usersData); // Initialize filteredUsers with all users
  }, []);

  return (
    <>
      <AdminNavigationBar
        open={navigationBarOpen}
        setOpen={setNavigationBarOpen}
      />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}>
        {!navigationBarOpen && (
          <img
            src={hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger} // Add styles to position it
            width={30}
            onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
          />
        )}
        <div className={styles.outerContainer}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.nameHeading}>Data Management Portal</h1>
              <ProfileIcon />
            </div>
            <div className={styles.buttonGroup}>
              <CustomToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}>
                <PurpleToggleButton value="user">
                  USER INFORMATION
                </PurpleToggleButton>
                <PurpleToggleButton value="training">
                  TRAINING INFORMATION
                </PurpleToggleButton>
                <PurpleToggleButton value="pathways">
                  PATHWAYS INFORMATION
                </PurpleToggleButton>
              </CustomToggleButtonGroup>
            </div>
            {/* Conditional Content Rendering */}
            <div className={styles.contentSection}>
              {alignment === "user" && (
                <>
                  <div className={styles.searchBarContainer}>
                    <OutlinedInput
                      sx={grayBorderSearchBar}
                      placeholder="Search..."
                      onChange={debouncedOnChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <IoIosSearch />
                        </InputAdornment>
                      }
                    />
                    <Button
                      sx={{
                        ...whiteButtonOceanGreenBorder,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        fontWeight: "bold",
                      }}>
                      Export
                    </Button>
                  </div>

                  <div className={styles.innerGrid}>
                    <DataGrid
                      rows={filteredUsers}
                      columns={usersColumns}
                      rowHeight={40}
                      checkboxSelection
                      pageSize={10}
                      sx={DataGridStyles}
                      components={{
                        ColumnUnsortedIcon: TbArrowsSort,
                        ColumnMenu: CustomColumnMenu,
                      }}
                      onRowClick={(row) => {}}
                      getRowId={(row) => row.auth_id} // Use auth_id as the unique ID for each row
                    />
                  </div>
                </>
              )}
              {alignment === "training" && (
                <>
                  <div className={styles.searchBarContainer}>
                    <OutlinedInput
                      sx={grayBorderSearchBar}
                      placeholder="Search..."
                      onChange={debouncedOnChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <IoIosSearch />
                        </InputAdornment>
                      }
                    />
                    <Button
                      sx={{
                        ...whiteButtonOceanGreenBorder,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        fontWeight: "bold",
                      }}>
                      Export
                    </Button>
                  </div>

                  <div className={styles.innerGrid}>
                    <DataGrid
                      rows={filteredTrainings}
                      columns={trainingsColumns}
                      rowHeight={40}
                      checkboxSelection
                      pageSize={10}
                      sx={DataGridStyles}
                      components={{
                        ColumnUnsortedIcon: TbArrowsSort,
                        ColumnMenu: CustomColumnMenu,
                      }}
                      onRowClick={(row) => {}}
                    />
                  </div>
                </>
              )}
              {alignment === "pathways" && (
                <>
                  <div className={styles.searchBarContainer}>
                    <OutlinedInput
                      sx={grayBorderSearchBar}
                      placeholder="Search..."
                      onChange={debouncedOnChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <IoIosSearch />
                        </InputAdornment>
                      }
                    />
                    <Button
                      sx={{
                        ...whiteButtonOceanGreenBorder,
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        fontWeight: "bold",
                      }}>
                      Export
                    </Button>
                  </div>

                  <div className={styles.innerGrid}>
                    <DataGrid
                      rows={filteredPathways}
                      columns={pathwaysColumns}
                      rowHeight={40}
                      checkboxSelection
                      pageSize={10}
                      sx={DataGridStyles}
                      components={{
                        ColumnUnsortedIcon: TbArrowsSort,
                        ColumnMenu: CustomColumnMenu,
                      }}
                      onRowClick={(row) => {}}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AdminUserManagement;

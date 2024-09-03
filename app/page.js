"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { firestore } from "@/firebase";

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "2px solid #f3b8ff",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
  color: "#7b268c",
};


export default function Home() {
  // We'll add our component logic here
  const [inventory, setInventory] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
    setShowAlert(true); // Show alert when item is added
    setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
  width="100vw"
  height="100vh"
  display={"flex"}
  justifyContent={"center"}
  flexDirection={"column"}
  alignItems={"center"}
  gap={2}
  
>
  {showAlert && (
    <Alert
      severity="info"
      sx={{
        backgroundColor: "#f3b8ff", // Set the background color
        color: "#7b268c", // Set the text color
        border: "1px solid #7b268c", // Set the border color
        "& .MuiAlert-icon": {
          color: "#7b268c", // Optional: Set the icon color to match the text
        },
      }}
    >
      Item Successfully Added!
    </Alert>
  )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add a New Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#7b268c", // Set the default outline color
                  },
                  "&:hover fieldset": {
                    borderColor: "#e399f2", // Set the outline color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#7b268c", // Set the outline color when focused
                  },
                  "& input": {
                    color: "#7b268c", // Set the text color of the input
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#7b268c", // Set the label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#7b268c", // Set the label color when focused
                },
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
              sx={{
                color: "#7b268c", // Set the text color
                backgroundColor: "#f3b8ff", // Set the background color
                borderColor: "#7b268c", // Set the border color if outlined
                "&:hover": {
                  borderColor: "#e399f2", // Border color on hover
                }
              }}
            >
              Add Item
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen}
      sx={{
        backgroundColor: "#f3b8ff", // Your desired background color
        color: "#7b268c", // Text color
        '&:hover': {
          backgroundColor: "#e399f2", // Hover background color
        },
      }}>
        Enter New Item
      </Button>
      <Box border={"1px solid #f3b8ff"}>
        <Box
          width="800px"
          height="100px"
          bgcolor={"#f3b8ff"}
          display={"flex"} 
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#7b268c"} textAlign={"center"}>
            Pantry Tracker
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={"auto"}>
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              paddingX={5}
            >
              <Typography variant={"h4"} color={"#7b268c"} textAlign={"center"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={"h4"} color={"#7b268c"} textAlign={"center"}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}
                sx={{
                  backgroundColor: "#f3b8ff", // Background color
                  color: "#7b268c", // Text color
                  '&:hover': {
                    backgroundColor: "#e399f2", // Hover background color
                  },
                }}>
                Remove Item
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

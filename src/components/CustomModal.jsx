import React, { useState } from "react"
import Box from "@mui/material/Box"
import Modal from "@mui/material/Modal"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import PropTypes from "prop-types"
import { Button, Typography, TextField } from "@mui/material"
import * as XLSX from "xlsx"

const CustomModal = ({ open, setOpen }) => {
  const [rows, setRows] = useState([{ id: 1, name: "", merk: "", price: "" }])

  const handleClose = () => {
    setRows([{ id: 1, name: "", merk: "", price: "" }])
    setOpen(false)
  }

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows]
    newRows[index][field] = value
    setRows(newRows)
  }

  const handleAddRow = () => {
    const newId = rows.length + 1
    setRows([...rows, { id: newId, name: "", merk: "", price: "" }])
  }

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8080/car/save-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ car: rows }),
      })

      if (response.ok) {
        alert("Changes saved successfully!")
        handleClose()
        window.location.reload()
      } else {
        throw new Error("Failed to save changes")
      }
    } catch (error) {
      console.error("Error saving data:", error)
      alert("Failed to save changes")
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      const transformedRows = excelData.slice(1).map((row, index) => ({
        id: index + 1,
        name: row[0],
        merk: row[1],
        price: row[2],
      }))

      setRows(transformedRows)
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 1,
            minWidth: 600,
            maxWidth: 800,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              edge='end'
              aria-label='close'
              onClick={handleClose}
              sx={{ position: "absolute", top: 10, right: 20 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: "700",
              textAlign: "center",
              color: "black",
              lineHeight: "30.12px",
              marginBottom: 2,
            }}
          >
            Add Data Car
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginBottom: 2,
            }}
          >
            <input
              type='file'
              accept='.xlsx, .xls'
              onChange={handleFileUpload}
              style={{ marginBottom: "20px" }}
            />
            <Typography gutterBottom>
              Upload data from Excel (.xlsx, .xls)
            </Typography>
          </Box>
          <Box
            sx={{
              maxHeight: "40vh",
              overflowY: "auto",
              pt: 1,
              pb: 1,
            }}
          >
            {rows.map((row, index) => (
              <Box
                key={row.id}
                sx={{
                  display: "flex",
                  marginBottom: 2,
                  paddingRight: "20px",
                }}
              >
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Name'
                  value={row.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                  sx={{ marginRight: 2 }}
                />
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Merk'
                  value={row.merk}
                  onChange={(e) =>
                    handleInputChange(index, "merk", e.target.value)
                  }
                  sx={{ marginRight: 2 }}
                />
                <TextField
                  fullWidth
                  variant='outlined'
                  label='Price'
                  value={row.price}
                  onChange={(e) =>
                    handleInputChange(index, "price", e.target.value)
                  }
                  type='number'
                />
              </Box>
            ))}
          </Box>
          <Box display='flex' justifyContent='center' sx={{ marginBottom: 2 }}>
            <Button variant='outlined' color='primary' onClick={handleAddRow}>
              Add Row
            </Button>
          </Box>
          <Box display='flex' justifyContent='center'>
            <Button variant='contained' color='primary' onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}

CustomModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
}

export default CustomModal

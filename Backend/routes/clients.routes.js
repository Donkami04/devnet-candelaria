const express = require("express");
const router = express.Router();
const { validateData } = require("../middlewares/validator.handler");
const { createClientSchema, editClientSchema } = require("../schemas/clients.schema");

const { getClients, createClient, editOneClient, deleteClient, getOneClient } = require("../controllers/clients");

router.get("/", async (req, res, next) => {
  try {
    const allClients = await getClients();
    res.json(allClients);
  } catch (error) {
    next(error);
  }
});

router.get("/:ip", async (req, res, next) => {
  try {
    const ip = req.params.ip;
    const client = await getOneClient(ip);
    res.status(client.status).json({
      status: client.status,
      message: client.message,
      error: client.error,
      data: client.data,
    });
  } catch (error) {
    next(error);
  }
});


router.post("/new", validateData(createClientSchema), async (req, res, next) => {
  try {
    const data = req.body;
    const newClient = await createClient(data);
    res.status(newClient.status).json({
      status: newClient.status,
      message: newClient.message,
      error: newClient.error,
      data: newClient.data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/edit/:id", validateData(editClientSchema), async (req, res, next) => {
  try {
    const id = req.params.id;
    const changes = req.body;
    const clientEdit = await editOneClient(id, changes);
    res.status(clientEdit.status).json({
      status: clientEdit.status,
      message: clientEdit.message,
      error: clientEdit.error,
      data: clientEdit.data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/remove/:ip", async (req, res, next) => {
  try {
    const ip = req.params.ip;
    const clientDeleted = await deleteClient(ip);
    res.status(clientDeleted.status).json({
      status: clientDeleted.status,
      message: clientDeleted.message,
      error: clientDeleted.error,
      data: clientDeleted.data,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;

import con from "../db/dbObject.js";
import generateId from "./genId.js";

export const userController = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    //first check if either email or phone number exists
    const [emailContacts, phoneContacts] = await Promise.all([
      email
        ? con.query("SELECT * FROM users WHERE email = $1", [email])
        : { rows: [] },
      phoneNumber
        ? con.query(`SELECT * FROM users WHERE "phoneNumber" = $1`, [
            phoneNumber,
          ])
        : { rows: [] },
    ]);
    console.log(emailContacts.rows, phoneContacts.rows);

    // none of the matches
    if (emailContacts.rows.length === 0 && phoneContacts.rows.length === 0) {
      const query = `
      INSERT INTO users (id, "phoneNumber", email, "linkedId", "linkPrecedence", "createdAt", "updatedAt", "deletedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
      const id = generateId();
      const values = [
        id,
        phoneNumber, // phoneNumber
        email, // email
        null, // linkedId
        "primary", // linkPrecedence
        new Date(), // createdAt
        new Date(), // updatedAt
        null, // deletedAt
      ];
      const result = await con.query(query, values);

      //generate the response in given format
      return res.status(200).json({
        contact: {
          primaryContatctId: id,
          emails: [email],
          phoneNumbers: [phoneNumber],
          secondaryContactIds: [],
        },
      });
    }

    //if email matches but not phoneNumber
    else if (
      emailContacts.rows.length !== 0 &&
      phoneContacts.rows.length === 0
    ) {
      //only email matches
      const matchedContact = emailContacts.rows[0];

      const query = `INSERT INTO users (id, "phoneNumber", "email", "linkedId", "linkPrecedence", "createdAt", "updatedAt", "deletedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;`;

      const id = generateId();
      const values = [
        id,
        phoneNumber, // phoneNumber
        email,
        matchedContact.id, // linkedId
        "secondary", // linkPrecedence
        new Date(), // createdAt
        new Date(), // updatedAt
        null, // deletedAt
      ];

      await con.query(query, values);
      console.log("Only one thing matches");
      return res.status(200).json({
        contact: {
          primaryContatctId: matchedContact.id,
          emails: [matchedContact.email],
          phoneNumbers: [matchedContact.phoneNumber, phoneNumber],
          secondaryContactIds: [id],
        },
      });
    } else if (
      emailContacts.rows.length === 0 &&
      phoneContacts.rows.length !== 0
    ) {
      //only phoneNumber matches
      const matchedContact = phoneContacts.rows[0];

      const query = `INSERT INTO users (id, "phoneNumber", "email", "linkedId", "linkPrecedence", "createdAt", "updatedAt", "deletedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

      const id = generateId();
      const values = [
        id,
        phoneNumber, // phoneNumber
        email,
        matchedContact.id, // linkedId
        "secondary", // linkPrecedence
        new Date(), // createdAt
        new Date(), // updatedAt
        null, // deletedAt
      ];

      const result = await con.query(query, values);

      //generate the response in given format
      return res.status(200).json({
        contact: {
          primaryContatctId: matchedContact.id,
          emails: [matchedContact.email, email],
          phoneNumbers: [matchedContact.phoneNumber],
          secondaryContactIds: [id],
        },
      });
    }
    if (emailContacts.rows.length !== 0 && phoneContacts.rows.length !== 0) {
      //both email and phoneNumber matches
      const matchedContactByPhone = phoneContacts.rows;
      const matchedContactByEmail = emailContacts.rows;

      if (matchedContactByPhone === matchedContactByEmail) {
        //the contanct is already in the db
        return res.status(200).json({
          contact: {
            primaryContatctId: matchedContact.id,
            emails: [email],
            phoneNumbers: [phoneNumber],
            secondaryContactIds: [],
          },
        });
      } else {
        //both email and phoneNumber matches but they are different contacts
        const primaryContact = matchedContactByEmail[0];
        const secondaryContact = matchedContactByPhone[0];

        //update the secondary contact to link to primary contact
        const updateQuery = `
          UPDATE users
          SET "linkedId" = $1, "linkPrecedence" = 'secondary', "updatedAt" = NOW()
          WHERE id = $2
        `;
        await con.query(updateQuery, [primaryContact.id, secondaryContact.id]);

        //generate the response in given format
        return res.status(200).json({
          contact: {
            primaryContatctId: primaryContact.id,
            emails: [primaryContact.email, secondaryContact.email],
            phoneNumbers: [
              primaryContact.phoneNumber,
              secondaryContact.phoneNumber,
            ],
            secondaryContactIds: [secondaryContact.id],
          },
        });
      }
    }
  } catch (err) {
    console.error("Error in userController:", err.stack);
    return res.status(500).json({ error: "Database error" });
  }
};

export const fetchAllUserController = async (req, res) => {
  const select_query = `SELECT * FROM users`;

  await con.query(select_query, (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return res.status(500).json({ error: "Database error" });
    } else if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      console.log("User fetched successfully", result.rows[0]);
      return res.status(200).send({ user: result.rows[0] });
    }
  });
};

export const fetchUserByIdController = (req, res) => {
  const { id } = req.params;

  const select_query = `SELECT * FROM users WHERE id = $1`;

  con.query(select_query, [id], (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return res.status(500).json({ error: "Database error" });
    } else if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      console.log("User fetched successfully", result.rows[0]);
      return res.status(200).json({ user: result.rows[0] });
    }
  });
};
export const deleteUserByEmailController = (req, res) => {
  const { email } = req.params;

  const delete_query = `DELETE FROM users WHERE email = $1 RETURNING *`;

  con.query(delete_query, [email], (err, result) => {
    if (err) {
      console.error("Error executing delete query", err.stack);
      return res.status(500).json({ error: "Database error" });
    } else if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    } else {
      console.log("User deleted successfully", result.rows[0]);
      return res
        .status(200)
        .json({ message: "User deleted", user: result.rows[0] });
    }
  });
};

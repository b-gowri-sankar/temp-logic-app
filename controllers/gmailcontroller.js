const sql = require("mssql");
const { CreateEmailWithPlayWright } = require("../main");

// (async () => {
// 	try {
// 		// make sure that any items are correctly URL encoded in the connection string
// 		await sql.connect(
// 			"Server=salemseatsdev.database.windows.net;Database=salemseats-dev;user id=appuser;password=Salem@1234;Encrypt=true"
// 		);
// 		const result = await sql.query`SELECT TOP (3) *
//         FROM [dbo].[GoogleEmails]
//         WHERE IsCreated IS NULL OR IsCreated  = 0`;
// 		console.log(result.recordset);
// 	} catch (err) {
// 		// ... error checks
// 	}
// })();

exports.createEmail = async (req, res) => {
	let MAX_EMAILS = 3;
	try {
		let count = 0;
		await sql.connect(
			"Server=salemseatsdev.database.windows.net;Database=salemseats-dev;user id=appuser;password=Salem@1234;Encrypt=true"
		);
		const result = await sql.query`SELECT TOP (${MAX_EMAILS}) *
                    FROM [dbo].[GoogleEmails]
                    WHERE IsCreated IS NULL OR IsCreated  = 0`;
		console.log(result.recordset);
		while (MAX_EMAILS != count) {
			if (result.recordset[count]) {
				await CreateEmailWithPlayWright(result.recordset[count]);
			}
			count++;
			await new Promise((r) => setTimeout(r, 2000));
		}
		return res.status(200).json({
			data: "Successfully Created Email",
		});
	} catch (error) {
		console.error(err);
		return res.status(500).json(err);
	}
};

const fs = require("fs");
async function pesquisarCep() {
    const https = require("https");
    const args = process.argv;
    const cep = args[2];

    https
        .get("https://viacep.com.br/ws/" + cep + "/json/", (res) => {
            let data = [];
            console.log("Status Code:", res.statusCode);

            res.on("data", (chunk) => {
                data.push(chunk);
            });

            res.on("end", () => {
                const dados = JSON.parse(Buffer.concat(data).toString());
                createFolder(dados);
                escreverDados(dados);
            });
        })
        .on("error", (err) => {
            console.log("Error: ", err.message);
        });
}

function escreverDados(dados) {
    fs.writeFile(dados.bairro + "/response_" + dados.bairro + ".json", JSON.stringify(dados, null, 2), (err) => {
        if (err) console.log(err);
        else {
            console.log("File written successfully\n");
            console.log("The written has the following contents:");
        }
    });
    //fs.writeFile(dados.bairro + "/tex.txt");
    createFolder(dados, dados.bairro + "/imagens");
}

function createFolder(cidade, subfolderName) {
    // Create main folder

    if (subfolderName) {
        const subfolderPath = "./" + subfolderName;

        // Create subfolder
        fs.mkdirSync(subfolderPath, { recursive: true });

        console.log(`Subfolder '${subfolderName}' created in '${cidade.bairro}'.`);
        return subfolderPath;
    }

    console.log(`Folder '${cidade.bairro}' created.`);
    return cidade.bairro;
}

// Example usage:
pesquisarCep();

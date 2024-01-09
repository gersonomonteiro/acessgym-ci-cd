const schedule = require("node-schedule");
const fetch = require("node-fetch");
const mysql = require("mysql2");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const constants = require("../config/constants.config");
const authConfig = require("../config/auth.config");
const Mailjet = require("node-mailjet");
const config = require("../config/mailjet.json");
const bcrypt = require('bcryptjs')
const dbConfig = require("../config/db.config");
const Configuration = require('../models/Configuration')

const path = require("path");
const fs = require("fs");

module.exports = {
  disableInspiredClient() {
    schedule.scheduleJob("58 23 * * *", function () {
      const url = `${constants.URL_BASE}/api/clients/ative`;
      fetch(url, {
        method: "get",
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
    });
  },
  sendClientNotificationByEmail() {
    schedule.scheduleJob("0 0 * * *", function () {
      const url = `${constants.URL_BASE}/api/clients/sendnotificationbyemail`;
      fetch(url, {
        method: "get",
      })
        .then((res) => res.json())
        .then((json) => console.log(json));
    });
  },
  dateCompare(d1, d2) {
    const date1 = d1;
    const date2 = d2;

    if (date1 < date2) {
      if (date1.getDate() <= date2.getDate()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  diffDays(dayTocheck, data) {
    const currentDate = new Date();
    const dbDate = new Date(data);
    const currentMidnight = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const dbMidnight = new Date(
      dbDate.getFullYear(),
      dbDate.getMonth(),
      dbDate.getDate()
    );
    const diffInMs = currentMidnight.getTime() - dbMidnight.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === dayTocheck) {
      return true;
    } else {
      return false;
    }
  },
  yearAndmonth(y) {
    const date = new Date();
    const year = date.getFullYear() - y;
    const month = date.getMonth() + 1;
    const yearAndMonth = [year, month.toString().padStart(2, "0")].join("-");
    return yearAndMonth;
  },

  sendEmail(message) {
    const mailjet = Mailjet.apiConnect(config.client_key, config.client_secret);

    const request = mailjet
      .post("send", {
        version: "v3.1",
      })
      .request(message);

    request
      .then((result) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
    return request;
  },
  gerarSenhaForte(tamanho) {
    const caracteres =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$:";
    let senha = "";

    for (let i = 0; i < tamanho; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      senha += caracteres[indice];
    }

    return senha;
  },
  setup() {

      const setup = Configuration.findOne({
        where: {
            name: 'setup',
        }
      })
      .then((setup) => {
        if (setup.value === 'false') {
          console.log("...Iniciando o setup...");

          const dbConfigNovo = Object.assign({}, dbConfig, { user: "root" });
          const connection = mysql.createConnection(dbConfigNovo);

          connection.connect((err) => {
            if (err) {
              console.error("Erro ao conectar com BD: ", err);
              return;
            }
            console.log("Conectado com BD MySQL.");
          });

          // Função para inserir dados de usuário
          const inserirDados = (query, data, callback) => {
            connection.query(query, data, (err, results) => {
              if (err) {
                callback(err);
                return;
              }

              callback(null);
            });
          };

          const password = this.gerarSenhaForte(12);
          let pwd = "pwd:" + password;
          // Convertendo a string para Base64
          const base64Pwd = Buffer.from(pwd).toString("base64");
          console.log(base64Pwd);
          const user = {
            firstname: "Super",
            lastname: "admin",
            phone: "9730357",
            email: "superadmin.accessgym@gmail.com",
            password: bcrypt.hashSync(password, 8),
            ative: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          const userQuery = "INSERT INTO users SET ?";

          const role = {
            name: "superadmin",
            description:
              "super admin role, that have all permission in the system",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const roleQuery = "INSERT INTO roles SET ?";

          const role_permission = {
            role_id: 1,
            permission_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const rolePermissionQuery = "INSERT INTO role_permissions SET ?";

          const user_role = {
            user_id: 1,
            role_id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const userRoleQuery = "INSERT INTO user_roles SET ?";

            inserirDados(userQuery, user, (err) => {
              if (err) {
                console.error("Erro ao criar Utilizador: ", err);
                return;
              }

              console.log("Utilizador adicionado.");

              inserirDados(roleQuery, role, (err) => {
                if (err) {
                  console.error("Erro ao criar Role: ", err);
                  return;
                }
                console.log("Role adicionado.");

                inserirDados(rolePermissionQuery, role_permission, (err) => {
                  if (err) {
                    console.error("Erro ao criar Role_permission: ", err);
                    return;
                  }
                  console.log("Role_permission adicionado.");

                  inserirDados(userRoleQuery, user_role, (err) => {
                    if (err) {
                      console.error("Erro ao criar User_role: ", err);
                      return;
                    }
                    console.log("User_role adicionado.");
                    const data = {
                      permissions: [
                          "CREATE_USER",
                          "READ_USER",
                          "UPDATE_USER",
                          "DELETE_USER"
                      ]
                    }
                    
                    const url = `${constants.URL_BASE}/api/setuprole/1`
                    
                    this.sendRequest(url, 'POST', data).then((response) => {
                      console.log('Role Atualizado com sucesso!')
                    }).catch((err) => {
                      console.log(err.message)
                    })
                    
                    let role = {
                      name: "internal",
                      description:
                        "Role que todo utilizador tem ao ser criado!",
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    };
          
                    let role_permission = {
                      role_id: 2,
                      permission_id: 5,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    };

                    inserirDados(roleQuery, role, (err) => {
                      if (err) {
                        console.error("Erro ao criar role: ", err);
                        return;
                      }
                    })
                    inserirDados(rolePermissionQuery, role_permission, (err) => {
                      if (err) {
                        console.error("Erro ao criar role_permission: ", err);
                        return;
                      }
                    })

                    console.log("Setup feito com sucesso!");
                    const setupUpdate = Configuration.update(
                      {
                          value: 'true',
                      },
                      {
                          where: {
                              name: 'setup',
                          },
                      }
                  )
                    .then((setupUpdate) => {                          
                      console.log("Setup status atualizado com sucesso!");
                        
                    })
                    .catch((err) => {
                      console.log("Falha na atualização do setup status: " + err.message);
                    })                   

                  });
                });
              });
            
          });
        }
      })
      .catch((err) => {
          console.log('Falha no setup: ' + err.message)
      })
    
  },
  sendRequest(url, method, body) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open(method, url, true);
      request.setRequestHeader("Authorization", "Bearer " + authConfig.TOKEN_INTERNAL);
      request.setRequestHeader("Content-Type", "application/json");

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          const response = JSON.parse(request.responseText);
          resolve(response);
        } else {
          reject(
            new Error(
              "Erro na solicitação. Código de status: " + request.status
            )
          );
        }
      };

      request.onerror = () => {
        reject(
          new Error(
            "Erro na solicitação. Não foi possível conectar ao servidor."
          )
        );
      };

      request.send(JSON.stringify(body));
    });
  },
};

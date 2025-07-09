const Client = require("../models/Client");
const Image = require("../models/Image");
const helper = require("../helper/helper");
const constants = require("../config/constants.config");
const { Op } = require('sequelize')
const moment = require("moment");
const {
  checkPermission,
  isAdminOrSuperadmin,
} = require("../helper/authHelper");

module.exports = {
  async index(req, res) {
    if (
      (await checkPermission(req, "READ_CLIENT")) ||
      (await isAdminOrSuperadmin(req))
    ) {
      const client = await Client.findAll({
        include: [
          {
            association: "image",
            attributes: ["path"],
          },
        ],
      });
      return res.json({ client });
    } else {
      return res
        .status(403)
        .send({ message: "Sem permissão para listar clientes." });
    }
  },
  async show(req, res) {
    if (
      (await checkPermission(req, "READ_CLIENT")) ||
      (await isAdminOrSuperadmin(req))
    ) {
      const client = Client.findOne({
        where: {
          cardCode: req.body.cardCode,
        },
        include: [
          {
            association: "image",
            attributes: ["path"],
          },
          {
            association: "access",
          },
        ],
      })
        .then((client) => {
          if (client) {
            if (client.image) {
              client.image.path = `${constants.URL_IMAGE}/api/uploads/${client.image.path}`;
            }
            return res.json({ client });
          } else {
            return res.json({ message: "Client not found" });
          }
        })
        .catch((err) => {
          return res.json(err).message;
        });
    } else {
      return res
        .status(403)
        .send({ message: "Sem permissão para listar cliente." });
    }
  },
  async showById(req, res) {
    if (
      (await checkPermission(req, "READ_CLIENT")) ||
      (await isAdminOrSuperadmin(req))
    ) {
      const client = Client.findOne({
        where: {
          id: req.params.id,
        },
        include: [
          {
            association: "image",
            attributes: ["path"],
          },
          {
            association: "access",
          },
        ],
      })
        .then((client) => {
          if (client) {
            if (client.image) {
              client.image.path = `${constants.URL_IMAGE}/api/uploads/${client.image.path}`;
            }
            return res.json({ client });
          } else {
            return res.json({ message: "Cliente não encontrado." });
          }
        })
        .catch((err) => {
          return res.json(err).message;
        });
    } else {
      return res
        .status(403)
        .send({ message: "Sem permissão para listar cliente." });
    }
  },
  async store(req, res) {
    if (
      (await checkPermission(req, "CREATE_CLIENT")) ||
      (await isAdminOrSuperadmin(req))
    ) {
      let data;
      const {
        fullName,
        phone,
        email,
        cardCode,
        genre,
        address,
        birthday,
        ative,
        monthlyPaymentDate,
      } = req.body;

      if (req.file) {
        data = {
          fullName,
          phone,
          email,
          cardCode,
          genre,
          address,
          birthday,
          ative: true,
          monthlyPaymentDate: new Date(),
          image: {
            path: req.file.filename,
          },
        };
      } else {
        data = {
          fullName,
          phone,
          email,
          cardCode,
          genre,
          address,
          birthday,
          ative: true,
          monthlyPaymentDate: new Date(),
        };
      }
      const client = Client.findOne({
        where: {
          cardCode: cardCode,
        },
      })
        .then((client) => {
          console.log(client);
          if (client) {
            res.status(400).send({
              message: "Falha! Cliente já existe!",
            });
          } else {
            Client.create(data, {
              include: [
                {
                  association: "image",
                },
              ],
            })
              .then((client) => {
                res.status(200).send({
                  message: "Cliente registado com sucesso!",
                });
              })
              .catch((err) => {
                return res.status(422).json(err.message);
              });
          }
        })
        .catch((err) => {
          return res.status(422).json(err.message);
        });
    } else {
      return res
        .status(403)
        .send({ message: "Sem permissão para criar cliente." });
    }
  },
  async update(req, res) {
    if (
      (await checkPermission(req, "UPDATE_CLIENT")) ||
      (await isAdminOrSuperadmin(req))
    ) {
      const {
        fullName,
        phone,
        email,
        address,
        birthday,
        genre,
        cardCode,
        ative,
        monthlyPaymentDate,
      } = req.body;

      const data = {
        fullName,
        phone,
        email,
        address,
        birthday,
        genre,
        cardCode,
        ative,
        monthlyPaymentDate,
      };

      const client = await Client.update(data, {
        where: {
          id: req.params.id,
        },
      })
        .then((client) => {
          if (req.file) {
            const image = Image.findOne({
              where: {
                client_id: req.params.id,
              },
            })
              .then((image) => {
                if (image) {
                  const image = Image.update(
                    {
                      path: req.file.filename,
                    },
                    {
                      where: {
                        client_id: req.params.id,
                      },
                    }
                  );
                } else {
                  const image = Image.create(
                    {
                      path: req.file.filename,
                      client_id: req.params.id,
                    },
                    {
                      where: {
                        client_id: req.params.id,
                      },
                    }
                  );
                }
                console.log(image);
                //return res.json({ client, image })
              })
              .catch(function (err) {
                return res.json(err);
              });
          }
          if (client == 0) {
            return res.json({
              message: "Falha, cliente não atualizada",
            });
          } else {
            return res.json({
              message: "Cliente atualizado com  sucesso.",
            });
          }
        })
        .catch(function (err) {
          return res.json(err).message;
        });
    } else {
      return res
        .status(403)
        .send({ message: "Sem permissão para atualizar cliente." });
    }
  },
  async remove(req, res) {
    if (
      (await checkPermission(req, "DELETE_CLIENT")) ||
      (await isAdminOrSuperadmin(req))
    ) {
      await Client.destroy({
        where: {
          id: req.params.id,
        },
      })
        .then((client) => {
          if (client == 0) {
            return res.status(400).json({
              message: "Falha, cliente não removido!",
            });
          } else {
            return res.json({
              message: "Cliente removido com  sucesso.",
            });
          }
        })
        .catch((err) =>
          res.json({
            message: err.message,
          })
        );
    } else {
      return res
        .status(403)
        .send({ message: "Sem permissão para remover cliente." });
    }
  },

  async inspiredMonthlyFee(req, res) {
    try {
      // 1) Calcula a data-limite de expiração
      const limitDate = helper.expirationCutOff();

      // 2) Faz UPDATE direto no banco para todos que já venceram
      const [rowsUpdated] = await Client.update(
        { ative: false },
        {
          where: {
            ative: true,
            monthlyPaymentDate: { [Op.lt]: limitDate },
          },
        }
      );

      if (rowsUpdated === 0) {
        return res
          .status(200)
          .json({ message: "Nenhum cliente para atualizar." });
      } 

      console.log(`Clientes atualizados: ${rowsUpdated}`);
      return res.status(200).json({
        message: "Assinaturas expiradas desativadas com sucesso.",
        updatedCount: rowsUpdated,
      });
    } catch (err) {
      console.log("Erro ao processar mensalidades inspiradas", err);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  },
  async sendClientNotificationByEmail(req, res) {
    try {
        const clients = await Client.findAll({
            where: { ative: true },
        });

        if (!clients || clients.length === 0) {
            return res.send({ message: "Sem cliente para enviar notificação" });
        }

        const notifications = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const client of clients) {
            // Data do último pagamento (ex: 2025-06-06)
            const lastPaymentDate = new Date(client.monthlyPaymentDate);
            
            // Data de vencimento = último pagamento + 1 mês (ex: 2025-07-06)
            const dueDate = new Date(lastPaymentDate);
            dueDate.setMonth(dueDate.getMonth() + 1);
            dueDate.setHours(0, 0, 0, 0);

            // Calcula diferença em dias (hoje - data de vencimento)
            const diffInMs = today - dueDate;
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            let emailMsg = null;

            // Se faltam 3 dias para o vencimento (diffInDays === -3)
            if (diffInDays === -3) {
                emailMsg = {
                    Messages: [{
                        From: { Email: "accessgym.cv@gmail.com", Name: "Accessgym" },
                        To: [{ Email: client.email, Name: client.fullName }],
                        Subject: "Lembrete de Mensalidade",
                        TextPart: `Prezado(a) ${client.fullName}, sua mensalidade vencerá em 3 dias (${dueDate.toLocaleDateString('pt-BR')}).`
                    }]
                };
            } 
            // Se está vencido (diffInDays >= 0)
            else if (diffInDays >= 0) {
                emailMsg = {
                    Messages: [{
                        From: { Email: "accessgym.cv@gmail.com", Name: "Accessgym" },
                        To: [{ Email: client.email, Name: client.fullName }],
                        Subject: "Mensalidade Vencida",
                        TextPart: `Prezado(a) ${client.fullName}, sua mensalidade está ${diffInDays === 0 ? 'vencendo hoje' : `vencida há ${diffInDays} dia(s)`}. Regularize seu pagamento.`
                    }]
                };
            }

            if (emailMsg) {
                try {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
                        throw new Error(`Email inválido: "${client.email}"`);
                    }

                    await helper.sendEmail(emailMsg);
                    notifications.push({
                        client: client.fullName,
                        email: client.email,
                        status: 'success',
                        lastPayment: lastPaymentDate.toISOString().split('T')[0],
                        dueDate: dueDate.toISOString().split('T')[0],
                        daysStatus: diffInDays === -3 ? '3_dias_antes' : 
                                   diffInDays === 0 ? 'vencendo_hoje' :
                                   diffInDays > 0 ? 'vencido' : 'nao_notificar'
                    });
                } catch (err) {
                    notifications.push({
                        client: client.fullName,
                        email: client.email,
                        status: 'error',
                        error: err.message,
                        lastPayment: lastPaymentDate.toISOString().split('T')[0],
                        dueDate: dueDate.toISOString().split('T')[0],
                        daysStatus: diffInDays === -3 ? '3_dias_antes' : 
                                   diffInDays === 0 ? 'vencendo_hoje' :
                                   diffInDays > 0 ? 'vencido' : 'nao_notificar'
                    });
                }
            } else {
                notifications.push({
                    client: client.fullName,
                    email: client.email,
                    status: 'not_notified',
                    lastPayment: lastPaymentDate.toISOString().split('T')[0],
                    dueDate: dueDate.toISOString().split('T')[0],
                    daysStatus: 'nao_notificar'
                });
            }
        }

        return res.status(200).json({
            message: "Processo de notificação concluído",
            notifications: notifications
        });

    } catch (err) {
        console.error("Erro no processo de notificação:", err);
        return res.status(500).json({
            message: "Erro ao processar notificações",
            error: err.message
        });
    }
  },
};

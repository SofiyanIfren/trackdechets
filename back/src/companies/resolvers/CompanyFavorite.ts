import prisma from "../../prisma";
import { CompanyFavoriteResolvers } from "../../generated/graphql/types";

const companyFavoriteResolvers: CompanyFavoriteResolvers = {
  transporterReceipt: async parent => {
    const transporterReceipt = await prisma.company
      .findUnique({ where: { siret: parent.siret } })
      .transporterReceipt();
    return transporterReceipt;
  },
  traderReceipt: async parent => {
    const traderReceipt = await prisma.company
      .findUnique({ where: { siret: parent.siret } })
      .traderReceipt();
    return traderReceipt;
  },
  brokerReceipt: async parent => {
    const brokerReceipt = await prisma.company
      .findUnique({ where: { siret: parent.siret } })
      .brokerReceipt();
    return brokerReceipt;
  },
  vhuAgrementBroyeur: parent => {
    return prisma.company
      .findUnique({ where: { siret: parent.siret } })
      .vhuAgrementBroyeur();
  },
  vhuAgrementDemolisseur: parent => {
    return prisma.company
      .findUnique({ where: { siret: parent.siret } })
      .vhuAgrementDemolisseur();
  }
};

export default companyFavoriteResolvers;

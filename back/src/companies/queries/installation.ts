import { prisma } from "../../generated/prisma-client";

/**
 * Returns the ICPE associated with this company if any
 * or null otherwise
 * The table installation is generated by the `etl`
 * container where we are consolidating data
 * (join and fuzzy join) from s3ic, irep, gerep
 * and sirene to associate a siret with an ICPE
 * @param siret
 */
export function getInstallation(siret: string) {
  return prisma
    .installations({
      where: {
        OR: [
          { s3icNumeroSiret: siret },
          { irepNumeroSiret: siret },
          { gerepNumeroSiret: siret },
          { sireneNumeroSiret: siret }
        ]
      }
    })
    .then(installations => {
      // return first installation if several match
      return installations ? installations[0] : null;
    });
}

/**
 * Returns list of rubriques of an ICPE
 * @param codeS3ic
 */
export function getRubriques(codeS3ic: string) {
  if (codeS3ic) {
    return prisma.rubriques({ where: { codeS3ic } });
  }
  return Promise.resolve([]);
}

/**
 * Returns list of GEREP declarations of an ICPE
 * @param codeS3ic
 */
export function getDeclarations(codeS3ic: string) {
  if (codeS3ic) {
    return prisma.declarations({ where: { codeS3ic } });
  }
  return Promise.resolve([]);
}
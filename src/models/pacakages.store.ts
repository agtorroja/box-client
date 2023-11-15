import { types } from "mobx-state-tree";
import { PackageModel, Package } from "../types";

export const PackageStore = types
  .model({
    packages: types.array(PackageModel),
  })
  .views((store) => ({
    get deliveredPackages() {
      // RETORNA LOS PACKAGES QUE FUERON ENTREGADOS
      return store.packages.filter((pack) => pack.status === "ENTREGADO");
    },
    get unassignedPackages() {
      // RETORNA LOS PACKAGES QUE NO ESTAN ASSIGANADOS (status = "unassigned")
      return store.packages.filter((pack) => pack.status === "unassigned");
    },
    get onDeliverPackages() {
      // RETORNA LOS PACKAGES QUE  ESTAN ASSIGANADOS PERO NO ENTREGADOS
      return store.packages.filter(
        (pack) => pack.status === "EN CURSO" || pack.status === "PENDIENTE"
      );
    },
  }))
  .actions((store) => ({
    //TODO este any tiene que ser Package[]
    setPackages(packages: any) {
      store.packages.push(...packages);
    },
  }));

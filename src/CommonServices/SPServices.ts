import { sp } from "@pnp/sp/presets/all";
import {
  IFilter,
  IListItems,
  IListItemUsingId,
  IAddList,
  IUpdateList,
  ISPList,
  IDetailsListGroup,
  ISPAttachment,
  IAttachDelete,
  ISPListChoiceField,
  ISPGrpMember,
  IAnotherListItems,
  IAnotherAddList,
  IAnotherUpdateList,
  IAnotherDeleteList,
  IAnotherListItemUsingId,
  IGetDocLibFiles,
  IDocuments,
  IAddDocLibFiles,
  IInsertFiles,
  IRemoveFiles,
} from "./ISPServicesProps";
import { IItemAddResult } from "@pnp/sp/items";
import "@pnp/sp/webs";
import { Web } from "@pnp/sp/webs";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";

const getAllUsers = async (): Promise<[]> => {
  return await sp.web.siteUsers();
};

const getSPGroupMember = async (params: ISPGrpMember): Promise<[]> => {
  return await sp.web.siteGroups.getByName(params.GroupName).users.get();
};
const AnotherformatInputs = (data: IAnotherListItems): IAnotherListItems => {
  if (!data.Select) data.Select = "*";
  if (!data.Topcount) data.Topcount = 5000;
  if (!data.Orderby) data.Orderby = "ID";
  if (!data.Expand) data.Expand = "";
  if (data.Orderbydecorasc !== true && data.Orderbydecorasc !== false) {
    data.Orderbydecorasc = true;
  }
  if (!data.PageCount) data.PageCount = 10;
  if (!data.PageNumber) data.PageNumber = 1;
  return data;
};

const formatFilterValue = (
  params: IFilter[],
  filterCondition: string,
): string => {
  let strFilter: string = "";
  if (params) {
    for (let i = 0; i < params.length; i++) {
      if (params[i].FilterKey) {
        if (i != 0) {
          if (filterCondition === "and" || filterCondition === "or") {
            strFilter += " " + filterCondition + " ";
          } else {
            strFilter += " and ";
          }
        }

        if (
          params[i].Operator.toLocaleLowerCase() === "eq" ||
          params[i].Operator.toLocaleLowerCase() === "ne" ||
          params[i].Operator.toLocaleLowerCase() === "gt" ||
          params[i].Operator.toLocaleLowerCase() === "lt" ||
          params[i].Operator.toLocaleLowerCase() === "ge" ||
          params[i].Operator.toLocaleLowerCase() === "le"
        )
          strFilter +=
            params[i].FilterKey +
            " " +
            params[i].Operator +
            "'" +
            params[i].FilterValue +
            "'";
        else if (params[i].Operator.toLocaleLowerCase() === "substringof")
          strFilter +=
            params[i].Operator +
            "('" +
            params[i].FilterKey +
            "','" +
            params[i].FilterValue +
            "')";
      }
    }
  }
  return strFilter;
};
const getAnotherSPReadItems = async (
  params: IAnotherListItems,
): Promise<any[]> => {
  const WebUrl = Web(params.SiteUrl);

  params = AnotherformatInputs(params);
  let filterValue: string = formatFilterValue(
    params.Filter,
    params.FilterCondition ? params.FilterCondition : "",
  );
  return await WebUrl.lists
    .getByTitle(params.Listname)
    .items.select(params.Select)
    .filter(filterValue)
    .expand(params.Expand)
    .top(params.Topcount)
    .orderBy(params.Orderby, params.Orderbydecorasc)
    .get();
};

const AnotherSPReadItemUsingId = async (
  params: IAnotherListItemUsingId,
): Promise<object> => {
  const WebUrl = Web(params.SiteUrl);
  if (!params.Select) params.Select = "";
  if (!params.Expand) params.Expand = "";
  return await WebUrl.lists
    .getByTitle(params.Listname)
    .items.getById(params.SelectedId)
    .select(params.Select)
    .expand(params.Expand)
    .get();
};

const AnotherSPAddItem = async (
  params: IAnotherAddList,
): Promise<IItemAddResult> => {
  const WebUrl = Web(params.SiteUrl);

  return await WebUrl.lists
    .getByTitle(params.Listname)
    .items.add(params.RequestJSON);
};

const AnotherSPUpdateItem = async (
  params: IAnotherUpdateList,
): Promise<IItemAddResult> => {
  const WebUrl = Web(params.SiteUrl);

  return await WebUrl.lists
    .getByTitle(params.Listname)
    .items.getById(params.ID)
    .update(params.RequestJSON);
};

const AnotherSPDeleteItem = async (
  params: IAnotherDeleteList,
): Promise<string> => {
  const WebUrl = Web(params.SiteUrl);

  return await WebUrl.lists
    .getByTitle(params.Listname)
    .items.getById(params.ID)
    .recycle();
};

const getDocLibFiles = async (params: IGetDocLibFiles): Promise<object[]> => {
  let FilesArr: IDocuments[] = [];
  await sp.web
    .getFolderByServerRelativePath(params.FilePath)
    .files.get()
    .then((DocRes) => {
      if (DocRes.length) {
        DocRes.forEach((item) => {
          FilesArr.push({
            name: item.Name,
            content: item,
            type: "Inlist",
            size: null,
          });
        });
      }
    })
    .catch((err) => console.log(err, "Get Document Library Files"));
  return FilesArr;
};

const addDocLibFiles = async (params: IAddDocLibFiles) => {
  let getFilePath: string = params.FilePath;
  if (params.Datas.length) {
    let delAttachments: IDocuments[] = params.Datas.filter(
      (files: IDocuments) => {
        return files.type === "Delete";
      },
    );

    let addAttachments: IDocuments[] = params.Datas.filter(
      (files: IDocuments) => {
        return files.type === "New";
      },
    );

    if (params.FolderNames.length) {
      for (let j: number = 0; j < params.FolderNames.length; j++) {
        await sp.web
          .getFolderByServerRelativePath(getFilePath)
          .folders.addUsingPath(params.FolderNames[j], true)
          .then(async (res) => {
            getFilePath = res.data.ServerRelativeUrl;
            if (j === params.FolderNames.length - 1 && delAttachments.length) {
              for (let k: number = 0; k < delAttachments.length; k++) {
                await sp.web
                  .getFolderByServerRelativePath(getFilePath)
                  .files.getByName(delAttachments[k].name)
                  .recycle()
                  .then(async (res: any) => {
                    if (
                      addAttachments.length &&
                      delAttachments.length - 1 === k
                    ) {
                      for (let i: number = 0; i < addAttachments.length; i++) {
                        await sp.web
                          .getFolderByServerRelativePath(getFilePath)
                          .files.addUsingPath(
                            addAttachments[i].name,
                            addAttachments[i].content,
                            {
                              Overwrite: true,
                            },
                          )
                          .then((file: any) => {
                            console.log("File added successfully", file);
                          })
                          .catch((error) => {
                            console.log("Error creating file", error);
                          });
                      }
                    }
                  })
                  .catch((error) => {
                    console.log("Delete  attachements", error);
                  });
              }
            } else if (
              j === params.FolderNames.length - 1 &&
              addAttachments.length
            ) {
              for (let z: number = 0; z < addAttachments.length; z++) {
                await sp.web
                  .getFolderByServerRelativePath(getFilePath)
                  .files.addUsingPath(
                    addAttachments[z].name,
                    addAttachments[z].content,
                    {
                      Overwrite: true,
                    },
                  )
                  .then((file: any) => {
                    console.log("File added successfully", file);
                  })
                  .catch((error) => {
                    console.log("Error creating file", error);
                  });
              }
            }
          })
          .catch((err) => console.log("creating folder", err));
      }
    } else {
      getFilePath = params.FilePath;
      if (delAttachments.length) {
        for (let i: number = 0; i < delAttachments.length; i++) {
          await sp.web
            .getFolderByServerRelativePath(getFilePath)
            .files.getByName(delAttachments[i].name)
            .recycle()
            .then(async (res: any) => {
              if (addAttachments.length && delAttachments.length - 1 === i) {
                for (let j: number = 0; j < addAttachments.length; j++) {
                  await sp.web
                    .getFolderByServerRelativePath(getFilePath)
                    .files.addUsingPath(
                      addAttachments[j].name,
                      addAttachments[j].content,
                      {
                        Overwrite: true,
                      },
                    )
                    .then((file: any) => {
                      console.log("File added successfully", file);
                    })
                    .catch((error) => {
                      console.log("Error creating file", error);
                    });
                }
              }
            })
            .catch((error) => console.log("Delete attachements", error));
        }
      } else if (addAttachments.length) {
        for (let i: number = 0; i < addAttachments.length; i++) {
          await sp.web
            .getFolderByServerRelativePath(params.FilePath)
            .files.addUsingPath(
              addAttachments[i].name,
              addAttachments[i].content,
              {
                Overwrite: true,
              },
            )
            .then((file: any) => {
              console.log("File added successfully", file);
            })
            .catch((error) => {
              console.log("Error creating file", error);
            });
        }
      }
    }
  }
  return getFilePath ? getDocLibFiles({ FilePath: getFilePath }) : [];
  // return getFilePath
};

const fileInsert = (params: IInsertFiles) => {
  if (params.files.length) {
    let insertFile: IDocuments[] = [...params.data];
    for (let i = 0; i < params.files.length; i++) {
      if (
        ![...insertFile].some((values) => {
          return (
            values.name === params.files[i].name && values.type !== "Delete"
          );
        })
      )
        insertFile.push({
          name: params.files[i].name,
          content: params.files[i],
          type: "New",
          size: params.files[i].size,
        });
    }
    return insertFile;
  } else {
    return [];
  }
};

const fileRemove = (params: IRemoveFiles) => {
  let removefiles: IDocuments[] = [...params.data];
  let item = removefiles[params.index];
  if (item.type === "Inlist") {
    removefiles[params.index] = { ...item, ["type"]: "Delete" };
  } else if (item.type === "New") {
    removefiles.splice(params.index, 1);
  }
  return removefiles;
};

const SPAddItem = async (params: IAddList): Promise<IItemAddResult> => {
  return await sp.web.lists
    .getByTitle(params.Listname)
    .items.add(params.RequestJSON);
};

const SPUpdateItem = async (params: IUpdateList): Promise<IItemAddResult> => {
  return await sp.web.lists
    .getByTitle(params.Listname)
    .items.getById(params.ID)
    .update(params.RequestJSON);
};

const SPDeleteItem = async (params: ISPList): Promise<string> => {
  return await sp.web.lists
    .getByTitle(params.Listname)
    .items.getById(params.ID)
    .recycle();
};

const formatInputs = (data: IListItems): IListItems => {
  if (!data.Select) data.Select = "*";
  if (!data.Topcount) data.Topcount = 5000;
  if (!data.Orderby) data.Orderby = "ID";
  if (!data.Expand) data.Expand = "";
  if (data.Orderbydecorasc !== true && data.Orderbydecorasc !== false) {
    data.Orderbydecorasc = true;
  }
  if (!data.PageCount) data.PageCount = 10;
  if (!data.PageNumber) data.PageNumber = 1;
  return data;
};
const SPReadItems = async (params: IListItems): Promise<any[]> => {
  params = formatInputs(params);
  let filterValue: string = formatFilterValue(
    params.Filter,
    params.FilterCondition ? params.FilterCondition : "",
  );

  return await sp.web.lists
    .getByTitle(params.Listname)
    .items.select(params.Select)
    .filter(filterValue)
    .expand(params.Expand)
    .top(params.Topcount)
    .orderBy(params.Orderby, params.Orderbydecorasc)
    .get();
};

const SPReadItemUsingId = async (params: IListItemUsingId): Promise<[]> => {
  return await sp.web.lists
    .getByTitle(params.Listname)
    .items.getById(params.SelectedId)
    .select(params.Select)
    .expand(params.Expand)
    .get();
};

const SPAddAttachments = async (params: ISPAttachment) => {
  const files: any[] = params.Attachments;
  return await sp.web.lists
    .getByTitle(params.ListName)
    .items.getById(params.ListID)
    .attachmentFiles.addMultiple(files);
};

const SPGetAttachments = async (params: ISPList) => {
  const item: any = sp.web.lists
    .getByTitle(params.Listname)
    .items.getById(params.ID);
  return await item.attachmentFiles();
};

const SPDeleteAttachments = async (params: IAttachDelete) => {
  return await sp.web.lists
    .getByTitle(params.ListName)
    .items.getById(params.ListID)
    .attachmentFiles.getByName(params.AttachmentName)
    .recycle();
};

const SPGetChoices = async (params: ISPListChoiceField) => {
  return await sp.web.lists
    .getByTitle(params.Listname)
    .fields.getByInternalNameOrTitle(params.FieldName)
    .get();
};

const SPDetailsListGroupItems = async (params: IDetailsListGroup) => {
  let newRecords: any[] = [];
  params.Data.forEach((arr: any, index: number) => {
    newRecords.push({
      Lesson: arr[params.Column],
      indexValue: index,
    });
  });

  let varGroup: any[] = [];
  let UniqueRecords = newRecords.reduce(function (item, e1) {
    let matches = item.filter(function (e2: any) {
      return e1[params.Column] === e2[params.Column];
    });

    if (matches.length === 0) {
      item.push(e1);
    }
    return item;
  }, []);

  UniqueRecords.forEach((ur: any) => {
    let recordLength = newRecords.filter((arr) => {
      return arr[params.Column] === ur[params.Column];
    }).length;
    varGroup.push({
      key: ur[params.Column],
      name: ur[params.Column],
      startIndex: ur.indexValue,
      count: recordLength,
    });
  });
  // console.log([...varGroup]);
  return varGroup;
};

// const readItemsFromSharepointListForDashbaord = async (
//   params: IListItems
// ): Promise<[]> => {
//   params = formatInputs(params);
//   let filterValue: string = formatFilterValue(
//     params.Filter,
//     params.FilterCondition ? params.FilterCondition : ""
//   );
//   let skipcount = params.PageNumber * params.PageCount - params.PageCount;

//   return await sp.web.lists
//     .getByTitle(params.Listname)
//     .items.select(params.Select)
//     .filter(filterValue)
//     .expand(params.Expand)
//     .skip(skipcount)
//     .top(params.PageCount)
//     .orderBy(params.Orderby, params.Orderbydecorasc)
//     .get();
// };

const batchInsert = async (params: {
  ListName: string;
  responseData: any[];
}): Promise<any> => {
  const list = sp.web.lists.getByTitle(params.ListName);
  const batch = sp.web.createBatch();
  const promises: any[] = [];

  for (const data of params.responseData) {
    const promise = list.items.inBatch(batch).add(data);
    promises.push(promise);
  }

  await batch
    .execute()
    .then(() => {
      return promises;
    })
    .catch((error) => console.log(error));
};

const batchUpdate = async (params: {
  ListName: string;
  responseData: any[];
}): Promise<any> => {
  const list = sp.web.lists.getByTitle(params.ListName);
  const batch = sp.web.createBatch();
  const promises: any[] = [];

  for (const data of params.responseData) {
    const promise = list.items.getById(data.ID).inBatch(batch).update(data);
    promises.push(promise);
  }

  await batch
    .execute()
    .then(() => {
      return promises;
    })
    .catch((error) => console.log(error));
};

const batchDelete = async (params: {
  ListName: string;
  responseData: any[];
}): Promise<any> => {
  const list = sp.web.lists.getByTitle(params.ListName);
  const batch = sp.web.createBatch();
  const promises: any[] = [];

  for (const data of params.responseData) {
    const promise = list.items.getById(data.ID).inBatch(batch).delete();
    promises.push(promise);
  }

  await batch
    .execute()
    .then(() => {
      return promises;
    })
    .catch((error) => console.log(error));
};

export default {
  getAllUsers,
  SPAddItem,
  SPUpdateItem,
  SPDeleteItem,
  SPReadItems,
  SPDetailsListGroupItems,
  SPGetChoices,
  SPAddAttachments,
  SPGetAttachments,
  SPDeleteAttachments,
  SPReadItemUsingId,
  batchInsert,
  batchUpdate,
  batchDelete,
  getSPGroupMember,
  getAnotherSPReadItems,
  AnotherSPAddItem,
  AnotherSPUpdateItem,
  AnotherSPDeleteItem,
  AnotherSPReadItemUsingId,
  getDocLibFiles,
  addDocLibFiles,
  fileInsert,
  fileRemove,
};

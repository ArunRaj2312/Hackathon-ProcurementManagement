/* eslint-disable @typescript-eslint/no-explicit-any */

import { IWeb } from "@pnp/sp/presets/all";

export interface ISiteConfig {
  SiteURL: IWeb | "";
  MainSiteURL: IWeb | "";
}

export interface IFilter {
  FilterKey: string | any;
  FilterValue: string | any;
  Operator: string | any;
}
export interface ISPGrpMember {
  GroupName: string;
}

export interface IListItems {
  Listname: string | any;
  Select?: string | any;
  Topcount?: number | any;
  Expand?: string | any;
  Orderby?: string | any;
  Orderbydecorasc?: boolean | any;
  Filter?: IFilter[] | any;
  FilterCondition?: string | any;
  PageCount?: number | any;
  PageNumber?: number | any;
}

export interface IUpdateListItems {
  Listname: string;
  Id: number;
  UpdateObject: any;
}

export interface IListItemUsingId {
  Listname: string | any;
  Select?: string | any;
  Expand?: string | any;
  SelectedId: number | any;
}

export interface IAddList {
  Listname: string | any;
  RequestJSON: object;
}

export interface ISPList {
  Listname: string | any;
  ID: number | any;
}

export interface ISPListChoiceField {
  Listname: string | any;
  FieldName: string | any;
}

export interface IUpdateList {
  Listname: string | any;
  RequestJSON: object;
  ID: number | any;
}

export interface IDetailsListGroup {
  Data: any[] | any;
  Column: string | any;
}

export interface IPeopleObj {
  key: number | any;
  imageUrl: string | any;
  text: string | any;
  secondaryText: string | any;
  ID: number | any;
  isValid: boolean | any;
}

export interface IAttachContents {
  name: string;
  content: [] | any;
}

export interface IAttachDelete {
  ListName: string | any;
  ListID: number | any;
  AttachmentName: string | any;
}

export interface ISPAttachments {
  ListName: string | any;
  ListID: number | any;
  Attachments: IAttachContents[] | any;
}
export interface ISPAttachment {
  ListName: string | any;
  FileName: string | any;
  ListID: number | any;
  Attachments: IAttachContents[] | any;
}

export interface ISPFolder {
  url: string;
  Select?: string | any;
  Expand?: string | any;
}

export interface ISPFolderFile {
  url: string;
  file: IAttachContents | any;
}

export interface IAnotherListItems {
  SiteUrl: string | any;
  Listname: string | any;
  Select?: string | any;
  Topcount?: number | any;
  Expand?: string | any;
  Orderby?: string | any;
  Orderbydecorasc?: boolean | any;
  Filter?: IFilter[] | any;
  FilterCondition?: string | any;
  PageCount?: number | any;
  PageNumber?: number | any;
}

export interface IAnotherAddList {
  SiteUrl: string;
  Listname: string;
  RequestJSON: object;
}

export interface IAnotherUpdateList {
  SiteUrl: string;
  Listname: string;
  RequestJSON: object;
  ID: number;
}

export interface IAnotherDeleteList {
  SiteUrl: string;
  Listname: string;
  ID: number;
}

export interface IGetDocLibFiles {
  FilePath: string;
}
export interface IDocuments {
  fileName?: string;
  name: string;
  content: any | string;
  type: string;
  size: number | null;
  etag?: string;
}
export interface IInsertFiles {
  data: IDocuments[];
  files: any[];
}

export interface IRemoveFiles {
  data: IDocuments[];
  index: number;
}
export interface IAddDocLibFiles {
  FilePath: string;
  FolderNames: string[];
  Datas: IDocuments[];
}

export interface IAnotherListItemUsingId {
  SiteUrl: string;
  Listname: string;
  Select?: string;
  Expand?: string;
  SelectedId: number;
}

export interface ISPGrpMember {
  GroupName: string;
}

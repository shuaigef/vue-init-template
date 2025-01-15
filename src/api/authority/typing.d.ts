declare namespace API {
  type AuthorityMeta = {
    hideMenu?: boolean;
    icon?: string;
    componentName?: string;
    title?: string;
  };

  type Authority = {
    id: string;
    code: string;
    name: string;
    orderNo: number;
    parentId: string;
    authorityType: string;
    redirect?: string;
    routePath: string;
    hidden: number;
    menuIcon?: string;
    component: string;
    componentName: string;
    createTime: string;
    updateTime: string;
    meta: API.AuthorityMeta;
    children?: API.Authority[];
    check?: boolean;
    node?: boolean;
  };

  type AuthorityQueryParams = {
    code?: string;
    name?: string;
    authorityType?: string;
  } & API.PageRequest;

  type AuthorityAddParams = {
    code: string;
    name: string;
    orderNo: number;
    parentId: string;
    authorityType: string;
    redirect?: string;
    routePath: string;
    hidden: number;
    menuIcon?: string;
    component: string;
    componentName: string;
  };

  type AuthorityUpdateParams = {
    id: string;
    code: string;
    name: string;
    orderNo: number;
    parentId: string;
    authorityType: string;
    redirect?: string;
    routePath: string;
    hidden: number;
    menuIcon?: string;
    component: string;
    componentName: string;
  };

  type RoleAuthorityUpdateParams = {
    roleId: string;
    authorityIds: string[];
  };
}

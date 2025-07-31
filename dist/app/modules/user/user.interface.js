"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var AgentStatus;
(function (AgentStatus) {
    AgentStatus["NONE"] = "NONE";
    AgentStatus["PENDING"] = "PENDING";
    AgentStatus["APPROVED"] = "APPROVED";
    AgentStatus["SUSPENDED"] = "SUSPENDED";
})(AgentStatus || (exports.AgentStatus = AgentStatus = {}));

const chalk = require('chalk');
const table = require('table');

class GenerateTable {
  CONFIG = {}
  constructor() {
    Object.defineProperties(this.CONFIG, {
      titles: {
        value: undefined,
        writable: true
      },
      base: {
        value: {
          header: {
            alignment: 'center',
            content: chalk.bold.redBright('Hostname Resolver Table')
          }
        },
        writable: true
      }
    });
  }
};

GenerateTable.prototype.isIps = function () {
  this.CONFIG.titles = ['OS System', 'Address', 'Version'];
  return this;
};

GenerateTable.prototype.isNs = function () {
  this.CONFIG.titles = ['Row', 'Namespace'];
  this.CONFIG.base.header.content = chalk.bold.redBright('Namespace Table (NS)');
  return this;
};

GenerateTable.prototype.isMx = function () {
  this.CONFIG.titles = ['Name', 'Priority'];
  this.CONFIG.base.header.content = chalk.bold.redBright('SMTP Server (MX)');
  return this;
};

GenerateTable.prototype.isSoa = function () {
  this.CONFIG.titles = ['Namespace', 'Mainspace', 'Serial', 'Refresh', 'Retry', 'Expire', 'Minttl'];
  this.CONFIG.base.header.content = chalk.bold.redBright('Authority Record Table (SOA)');
  return this;
};

GenerateTable.prototype.isCaa = function () {
  this.CONFIG.titles = ['Critical', 'Issue Id', 'Issue', 'Contact Email', 'Contact Phone', 'IODef'];
  this.CONFIG.base.header.content = chalk.bold.redBright('Certification Authority Record Table (CAA)');
  return this;
};

GenerateTable.prototype.isTxt = function () {
  this.CONFIG.base.header.content = chalk.bold.redBright('Text Queries Table (TXT)');
  return this;
};

GenerateTable.prototype.isCname = function () {
  this.CONFIG.titles = ['Hostname'];
  this.CONFIG.base.header.content = chalk.bold.redBright('Canonical Name Records Table (CNAME)');
  return this;
};

GenerateTable.prototype.isSrv = function () {
  this.CONFIG.titles = ['Service Name', 'Port', 'Priority', 'Weight'];
  this.CONFIG.base.header.content = chalk.bold.redBright('Service Records Table (SRV)');
  return this;
};

GenerateTable.prototype.generateIPTable = function (originalData) {
  const config = {
    ...this.CONFIG.base,
    columns: [
      { alignment: 'center' }, 
      {},
      { alignment: 'center' }
    ],
    spanningCells: [
      { col: 0, row: 1, rowSpan: 2, verticalAlignment: 'middle' }
    ]
  };
  console.log(
    table.table([this.CONFIG.titles, ...originalData], config)
  );
};

GenerateTable.prototype.generateNsTable = function (originalData) {
  const config = {
    ...this.CONFIG.base,
    columns: [
      { alignment: 'center' }
    ]
  };
  console.log(
    table.table([this.CONFIG.titles, ...originalData], config)
  );
};

GenerateTable.prototype.generateMxTable = function (originalData) {
  const config = {
    ...this.CONFIG.base,
    columns: [
      { alignment: 'left' },
      { alignment: 'center' }
    ]
  };
  console.log(
    table.table([this.CONFIG.titles, ...originalData], config)
  );
};

GenerateTable.prototype.generateSoaTable = function (originalData) {
  console.log(
    table.table([this.CONFIG.titles, ...originalData], this.CONFIG.base)
  );
};

GenerateTable.prototype.generateCaaTable = function (originalData) {
  console.log(
    table.table([this.CONFIG.titles, ...originalData], this.CONFIG.base)
  );
};

GenerateTable.prototype.generateTxtTable = function (originalData) {
  console.log(
    table.table(originalData, this.CONFIG.base)
  );
};

GenerateTable.prototype.generateCnameTable = function (originalData) {
  console.log(
    table.table([this.CONFIG.titles, ...originalData], this.CONFIG.base)
  );
};

GenerateTable.prototype.generateSrvTable = function (originalData) {
  console.log(
    table.table([this.CONFIG.titles, ...originalData], this.CONFIG.base)
  );
};

module.exports = GenerateTable;
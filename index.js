#! /usr/bin/env node
const { promises } = require('dns');
const os = require('os');
const ascii_text_generator = require('ascii-text-generator');
const chalk = require('chalk');

const BANNER = 'HLookup\\n';

const GenerateTable = require('./tables');

function processArguments(...args) {
  let hostname = args.slice(2, 3);
  let params = args.slice(3);

  let isSetDnsServer = params.find(param => param === '--dns');
  let isAll = params.find(param => param === '--all');

  return ({
    hostname: hostname[0],
    system: os.platform(),
    dnsList: !isSetDnsServer ? 
      ['8.8.8.8', '1.1.1.1'] : 
      params[params.indexOf('--dns') + 1].split(',').map(param => param.trim()),
    isAll: !isAll ? false : isAll 
  });
}

function handler(args) {
  let { dnsList, hostname, system, isAll } = processArguments(...args);
  const defaultOption = { 
    family: 0, 
    all: true 
  };

  return new Promise(async (resolve, reject) => {
    promises.setServers(dnsList);

    var ips, mx, soa, ns, cname, caa, srv, txt;

    try {
      ips = (await promises.lookup(hostname, defaultOption)).map(
        (ip, index) => [index === 0 ? system : '', ip.address, ip.family]
      );
    } catch {
      reject(new Error('[NOTIFY] Hostname is invalid!!'));
    }

    if (isAll) {
      try {
        mx = (await promises.resolveMx(hostname)).map(_mx => ([_mx.exchange, _mx.priority]));
      } catch {}

      try {
        soa = await promises.resolveSoa(hostname);
        soa = soa instanceof Object ? 
          [Object.values(soa)] :
          soa.map(_soa => ([_soa.nsname, _soa.hostmaster, _soa.serial, _soa.refresh, _soa.retry, _soa.expire, _soa.minttl]));
      } catch {}

      try {
        ns = (await promises.resolveNs(hostname)).map((namespace, index) => ([index + 1, namespace]));
      } catch {}

      try {
        cname = (await promises.resolveCname(hostname)).map(_cname => ([_cname]));
      } catch {}

      try {
        caa = (await promises.resolveCaa(hostname)).map(_caa => ([
          _caa.critical, _caa.issuewild, _caa.issue, 
          _caa.contactemail, _caa.contactphone, _caa.iodef
        ]));
      } catch {}

      try {
        srv = (await promises.resolveSrv(hostname)).map(_srv => ([
          _srv.name, _srv.port, _srv.priority, _srv.weight
        ]));
      } catch {}

      try {
        txt = (await promises.resolveTxt(hostname));
      } catch {}

      resolve({
        ips,
        ...(mx ? { mx }: {}),
        ...(soa ? { soa }: {}),
        ...(ns ? { ns }: {}),
        ...(cname ? { cname }: {}),
        ...(caa ? { caa }: {}),
        ...(srv ? { srv }: {}),
        ...(txt ? { txt }: {}),
      });
    } else {
      resolve({ ips });
    }
  })
}

async function main(args) {
  return await handler(args);
}

main(process.argv).then((res) => {
  console.log(chalk.bold.redBright(ascii_text_generator(BANNER, "2")));

  const tableCreator = new GenerateTable();

  tableCreator.isIps().generateIPTable(res.ips);

  if (res.ns) {
    tableCreator.isNs().generateNsTable(res.ns);
  }

  if (res.mx) {
    tableCreator.isMx().generateMxTable(res.mx);
  }

  if (res.soa) {
    tableCreator.isSoa().generateSoaTable(res.soa);
  }

  if (res.caa) {
    tableCreator.isCaa().generateCaaTable(res.caa);
  }

  if (res.txt) {
    tableCreator.isTxt().generateTxtTable(res.txt);
  }

  if (res.cname) {
    tableCreator.isCname().generateCnameTable(res.cname);
  }

  if (res.srv) {
    tableCreator.isSrv().generateSrvTable(res.srv);
  }
});
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false });

export function parseXMLtoJSON(xml) {
    const json = parser.parse(xml);
    return json.jobs?.job || []; // Adjust based on actual XML structure
}

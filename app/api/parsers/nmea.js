
const m_hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

function toHexString(v) {
    const msn = (v >> 4) & 0x0f;
    const lsn = (v >> 0) & 0x0f;
    return m_hex[msn] + m_hex[lsn];
}

function computeNmeaChecksum(sentenceWithoutChecksum) {
    // init to first character value after the $
    let checksum = sentenceWithoutChecksum.charCodeAt(1);
    // process rest of characters, zero delimited
    for (let i = 2; i < sentenceWithoutChecksum.length; i += 1) {
        checksum ^= sentenceWithoutChecksum.charCodeAt(i);
    }
    // checksum is between 0x00 and 0xff
    checksum &= 0xff;
    return checksum;
}



export function createSentence(message) {
  const checksum = toHexString(computeNmeaChecksum(message));
  return `${message}*${checksum}`;
}

export default {
  createSentence,
}

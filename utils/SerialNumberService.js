const { SerialNumber } = require('../models');

class SerialNumberService {
  async generateNextSerialNumber(formName) {
    const serialNumberMaster = await SerialNumber.findOne({ where: { form: formName } });

    if (!serialNumberMaster) {
      throw new Error(`Serial Number Not Found for form: ${formName}`);
    }

    // Example logic to generate the next serial number (e.g., increment the numeric part)
    const nextSerialNumber = this.incrementSerialNumber(serialNumberMaster.code);
    const completeSerialNumber = `${serialNumberMaster.prefix}${nextSerialNumber}`;

    return { nextSerialNumber, completeSerialNumber };
  }

  async updateSerialNumber(formName, nextSerialNumber) {
    const serialNumberMaster = await SerialNumber.findOne({ where: { form: formName } });

    if (!serialNumberMaster) {
      throw new Error(`Serial Number Not Found for form: ${formName}`);
    }

    serialNumberMaster.code = nextSerialNumber;
    await serialNumberMaster.save();
  }

  incrementSerialNumber(currentSerial) {
    // Logic to increment the serial number
    const serialNumber = parseInt(currentSerial, 10);
    return String(serialNumber + 1).padStart(currentSerial.length, '0');
  }
}

module.exports = new SerialNumberService();

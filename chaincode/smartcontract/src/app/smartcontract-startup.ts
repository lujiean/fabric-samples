/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/
import shim = require('fabric-shim');
import { BcBankSmartContract } from './bcbank/bcbank-smartcontract';
shim.start(new BcBankSmartContract());

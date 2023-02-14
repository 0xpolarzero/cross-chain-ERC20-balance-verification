// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

library Utils {
  function stringToAddress(string memory _str) internal pure returns (address) {
    bytes memory tmp = bytes(_str);
    uint160 iaddr = 0;
    uint160 b1;
    uint160 b2;

    for (uint i = 2; i < 2 + 2 * 20; i += 2) {
      iaddr *= 256;
      b1 = uint160(uint8(tmp[i]));
      b2 = uint160(uint8(tmp[i + 1]));
      if ((b1 >= 97) && (b1 <= 102)) {
        b1 -= 87;
      } else if ((b1 >= 65) && (b1 <= 70)) {
        b1 -= 55;
      } else if ((b1 >= 48) && (b1 <= 57)) {
        b1 -= 48;
      }
      if ((b2 >= 97) && (b2 <= 102)) {
        b2 -= 87;
      } else if ((b2 >= 65) && (b2 <= 70)) {
        b2 -= 55;
      } else if ((b2 >= 48) && (b2 <= 57)) {
        b2 -= 48;
      }

      iaddr += (b1 * 16 + b2);
    }

    return address(iaddr);
  }

  /**
   * @dev Not used
   */
  function stringToUint(string memory _str) internal pure returns (uint256) {
    bytes memory str = bytes(_str);
    uint256 result = 0;

    for (uint256 i = 0; i < str.length; i++) {
      uint256 c = uint256(uint8(str[i]));
      if (c >= 48 && c <= 57) {
        result = result * 10 + (c - 48);
      }
    }

    return result;
  }

  /**
   * @dev The following functions will trigger an undefined error
   * caused in the split loop
   */
  /* function retrieveData(bytes memory _data) internal pure returns (address userAddress, uint256 userBalance) {
    string memory result = string(_data);
    (string memory userAddressString, string memory userBalanceString) = split(result, 42);
    userAddress = stringToAddress(userAddressString);
    userBalance = stringToUint(userBalanceString);
  }

  function split(string memory _str, uint256 _index) internal pure returns (string memory partA, string memory partB) {
    bytes memory str = bytes(_str);
    bytes memory partABytes = new bytes(_index);
    bytes memory partBBytes = new bytes(str.length - _index);

    for (uint256 i = 0; i < str.length; i++) {
      if (i < _index) {
        partABytes[i] = str[i];
      } else {
        partBBytes[i - _index] = str[i];
      }
      if (i == _index - 1) {
        break;
      }
    }

    partA = string(partABytes);
    partB = string(partBBytes);

    return (partA, partB);
  } */
}

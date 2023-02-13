// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

library Utils {
  function retrieveData(bytes memory _data) internal pure returns (address userAddress, uint256 userBalance) {
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
    }

    partA = string(partABytes);
    partB = string(partBBytes);

    return (partA, partB);
  }

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

  function stringToAddress(string memory _str) internal pure returns (address) {
    bytes memory str = bytes(_str);
    uint256 result = 0;
    uint256 b = 1;

    for (uint256 i = str.length; i > 0; i--) {
      uint256 c = uint256(uint8(str[i - 1]));
      if (c >= 48 && c <= 57) {
        result += uint256((c - 48) * b) * 16;
      } else if (c >= 65 && c <= 70) {
        result += uint256((c - 55) * b);
      } else if (c >= 97 && c <= 102) {
        result += uint256((c - 87) * b) * 16;
      }
      b *= 16;
    }

    return address(uint160(result));
  }
}

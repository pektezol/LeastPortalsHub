package parser

import (
	"errors"
	"math"
	"os"

	"github.com/pektezol/bitreader"
)

// Don't try to understand it, feel it.
func ProcessDemo(filePath string) (portalCount int, tickCount int, err error) {
	file, err := os.Open(filePath)
	if err != nil {
		return 0, 0, err
	}
	reader := bitreader.NewReader(file, true)
	demoFileStamp := reader.TryReadString()
	demoProtocol := reader.TryReadSInt32()
	networkProtocol := reader.TryReadSInt32()
	reader.SkipBytes(1056)
	if demoFileStamp != "HL2DEMO" {
		return 0, 0, errors.New("invalid demo file stamp")
	}
	if demoProtocol != 4 {
		return 0, 0, errors.New("this parser only supports demos from new engine")
	}
	if networkProtocol != 2001 {
		return 0, 0, errors.New("this parser only supports demos from portal 2")
	}
	for {
		packetType := reader.TryReadUInt8()
		reader.SkipBits(40)
		switch packetType {
		case 1:
			reader.SkipBytes(160)
			reader.SkipBytes(uint64(reader.TryReadSInt32()))
		case 2:
			reader.SkipBytes(160)
			size := reader.TryReadUInt32()
			packetReader := bitreader.NewReaderFromBytes(reader.TryReadBytesToSlice(uint64(size)), true)
			for {
				messageType, err := packetReader.ReadBits(6)
				if err != nil {
					break
				}
				switch messageType {
				case 0:
				case 1:
					packetReader.TryReadString()
				case 2:
					packetReader.SkipBytes(4)
					packetReader.TryReadString()
					packetReader.SkipBits(2)
				case 3:
					packetReader.SkipBits(1)
				case 4:
					packetReader.SkipBytes(8)
				case 5:
					packetReader.TryReadString()
				case 6:
					for count := 0; count < int(packetReader.TryReadUInt8()); count++ {
						packetReader.TryReadString()
						packetReader.TryReadString()
					}
				case 7:
					packetReader.SkipBytes(9)
					idsLength := packetReader.TryReadUInt32()
					if idsLength > 0 {
						packetReader.SkipBytes(uint64(idsLength))
					}
					mapLength := packetReader.TryReadUInt32()
					if mapLength > 0 {
						packetReader.TryReadStringLength(uint64(mapLength))
					}
				case 8:
					packetReader.SkipBits(210)
					packetReader.TryReadStringLength(1)
					packetReader.TryReadString()
					packetReader.TryReadString()
					packetReader.TryReadString()
					packetReader.TryReadString()
				case 9:
					packetReader.SkipBits(1)
					packetReader.SkipBits(uint64(packetReader.TryReadUInt8()))
				case 10:
					classCount := packetReader.TryReadUInt16()
					if !packetReader.TryReadBool() {
						for count := 0; count < int(classCount); count++ {
							packetReader.SkipBits(uint64(math.Log2(float64(classCount)) + 1))
							packetReader.TryReadString()
							packetReader.TryReadString()
						}
					}
				case 11:
					packetReader.SkipBits(1)
				case 12:
					packetReader.TryReadString()
					maxEntries := packetReader.TryReadSInt16()
					packetReader.SkipBits(uint64(math.Log2(float64(maxEntries))) + 1)
					length := packetReader.TryReadBits(20)
					if packetReader.TryReadBool() {
						packetReader.SkipBytes(2)
					}
					packetReader.SkipBits(2)
					packetReader.SkipBits(length)
				case 13:
					packetReader.SkipBits(5)
					if packetReader.TryReadBool() {
						packetReader.SkipBytes(2)
					}
					packetReader.SkipBits(packetReader.TryReadBits(20))
				case 14:
					packetReader.TryReadString()
					if packetReader.TryReadUInt8() == 255 {
						packetReader.SkipBytes(4)
					}
				case 15:
					packetReader.SkipBytes(2)
					packetReader.SkipBits(uint64(packetReader.TryReadUInt16()))
				case 16:
					packetReader.TryReadString()
				case 17:
					var length uint16
					if packetReader.TryReadBool() {
						length = uint16(packetReader.TryReadUInt8())
					} else {
						packetReader.SkipBytes(1)
						length = packetReader.TryReadUInt16()
					}
					packetReader.SkipBits(uint64(length))
				case 18:
					packetReader.SkipBits(11)
				case 19:
					packetReader.SkipBits(49)
				case 20:
					packetReader.SkipBits(48)
				case 21:
					readVectorCoord := func() float32 {
						value := float32(0)
						integer := packetReader.TryReadBits(1)
						fraction := packetReader.TryReadBits(1)
						if integer != 0 || fraction != 0 {
							sign := packetReader.TryReadBits(1)
							if integer != 0 {
								integer = packetReader.TryReadBits(uint64(14)) + 1
							}
							if fraction != 0 {
								fraction = packetReader.TryReadBits(uint64(5))
							}
							value = float32(integer) + float32(fraction)*(1.0/float32(1<<5))
							if sign != 0 {
								value = -value
							}
						}
						return value
					}
					packetReader.SkipBits(3)
					readVectorCoord()
					readVectorCoord()
					readVectorCoord()
					packetReader.SkipBits(9)
					if packetReader.TryReadBool() {
						packetReader.SkipBits(22)
					}
					packetReader.SkipBits(1)
				case 22:
					packetReader.SkipBits(1)
					packetReader.SkipBits(packetReader.TryReadBits(11))
				case 23:
					msgType := int8(packetReader.TryReadBits(8))
					msgLength := packetReader.TryReadBits(12)
					userMessageReader := bitreader.NewReaderFromBytes(packetReader.TryReadBitsToSlice(msgLength), true)
					switch msgType {
					case 60:
						scoreboardTempUpdate := struct {
							NumPortals int32
							TimeTaken  int32
						}{
							NumPortals: userMessageReader.TryReadSInt32(),
							TimeTaken:  userMessageReader.TryReadSInt32(),
						}
						portalCount = int(scoreboardTempUpdate.NumPortals)
						tickCount = int(math.Round(float64((float32(scoreboardTempUpdate.TimeTaken) / 100.0) / float32(1.0/60.0))))
					}
				case 24:
					packetReader.SkipBits(20)
					packetReader.SkipBits(packetReader.TryReadBits(11))
				case 25:
					packetReader.SkipBits(packetReader.TryReadBits(11))
				case 26:
					packetReader.SkipBits(11)
					if packetReader.TryReadBool() {
						packetReader.SkipBytes(4)
					}
					packetReader.SkipBits(12)
					length := packetReader.TryReadBits(20)
					packetReader.SkipBits(1)
					packetReader.SkipBits(length)

				case 27:
					packetReader.SkipBits(8)
					packetReader.SkipBits(packetReader.TryReadBits(17))
				case 28:
					packetReader.SkipBits(13)
				case 29:
					packetReader.SkipBits(16)
					packetReader.SkipBits(packetReader.TryReadBits(32))
				case 30:
					packetReader.SkipBits(9)
					packetReader.SkipBits(packetReader.TryReadBits(20))
				case 31:
					packetReader.SkipBits(32)
					packetReader.TryReadString()
				case 32:
					packetReader.SkipBytes(packetReader.TryReadBits(32))
				case 33:
					packetReader.SkipBits(packetReader.TryReadBits(32))
				default:
					panic("unknown msg type")
				}
			}
		case 3, 7:
		case 4, 6, 9:
			reader.SkipBytes(uint64(reader.TryReadSInt32()))
		case 5, 8:
			reader.SkipBits(32)
			reader.SkipBytes(uint64(reader.TryReadSInt32()))
		default:
			return 0, 0, errors.New("invalid packet type")
		}
		if packetType == 7 {
			break
		}
	}
	return portalCount, tickCount, nil
}

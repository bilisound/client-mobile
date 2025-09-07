"use client";
import React from "react";
import { View } from "react-native";
import ActionSheet, { registerSheet } from "react-native-actions-sheet";
import { SpeedControlPanel } from "~/components/main-bottom-sheet/components/speed-control-panel";
import { SPEED_PRESETS } from "~/components/main-bottom-sheet/constants";
import {
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "~/components/ui/actionsheet-next";
import { Button, ButtonOuter, ButtonText } from "~/components/ui/button";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "~/components/ui/checkbox";
import { CheckIcon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { usePlaybackSpeedStore } from "~/store/playback-speed";

const SHEET_ID = "player-speed-menu";

function PlayerSpeedMenuSheet() {
  const { speedValue, retainPitch, applySpeed } = usePlaybackSpeedStore(state => ({
    speedValue: state.speedValue,
    retainPitch: state.retainPitch,
    applySpeed: state.applySpeed,
  }));

  return (
    <ActionSheet
      sheetId={SHEET_ID}
      containerStyle={{
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        shadowColor: "transparent",
        shadowOpacity: 0,
        elevation: 0,
      }}
      indicatorStyle={{ backgroundColor: "transparent" }}
      elevation={0}
      CustomHeaderComponent={<View style={{ height: 0 }} />}
      gestureEnabled
      closeOnTouchBackdrop
    >
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <View className={"w-full px-4 pt-4 pb-6"}>
          <SpeedControlPanel />
          <View className="flex-row flex-wrap justify-center gap-2 mt-4">
            {SPEED_PRESETS.map(item => {
              const button = (
                <ButtonOuter key={item.text}>
                  <Button
                    className={"w-14 p-0"}
                    variant={"outline"}
                    size={"sm"}
                    onPress={() => {
                      applySpeed(item.speed, retainPitch);
                    }}
                  >
                    <ButtonText>{item.text}</ButtonText>
                  </Button>
                </ButtonOuter>
              );

              if (item.speed === 1) {
                return (
                  <View className={"gap-1 items-center"} key={item.text}>
                    {button}
                    <Text className={"text-primary-500 text-xs"}>正常速度</Text>
                  </View>
                );
              }

              return button;
            })}
          </View>
          <Checkbox
            size="md"
            isInvalid={false}
            isDisabled={false}
            value={""}
            isChecked={retainPitch}
            onChange={e => {
              applySpeed(speedValue, e);
            }}
            className={"mt-4"}
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel className={"text-sm"}>变速不变调</CheckboxLabel>
          </Checkbox>
        </View>
      </ActionsheetContent>
    </ActionSheet>
  );
}

registerSheet(SHEET_ID, PlayerSpeedMenuSheet);

export {};

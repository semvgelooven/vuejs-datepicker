import DateInput from "@/components/DateInput.vue";
import { shallow } from "@vue/test-utils";
import { en } from "@/locale";

describe("DateInput", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(DateInput, {
      propsData: {
        format: "dd MMM yyyy",
        translation: en,
        typeable: true,
      },
    });
  });

  it("does not format the date when typed", () => {
    const dateString = "2018-04-24";
    wrapper.vm.input.value = dateString;
    expect(wrapper.vm.input.value).toEqual(dateString);
    wrapper.setData({
      typedDate: dateString,
    });
    wrapper.setProps({
      selectedDate: new Date(dateString),
    });
    expect(wrapper.vm.typedDate).toEqual(dateString);
    expect(wrapper.vm.formattedValue).toEqual(dateString);
  });

  it("emits the date when typed", () => {
    const input = wrapper.find("input");
    wrapper.vm.input.value = "2018-04-24";
    input.trigger("keyup");
    expect(wrapper.emitted().typedDate).toBeDefined();
    expect(wrapper.emitted().typedDate[0][0]).toBeInstanceOf(Date);
  });

  it("allows custom date format", () => {
    const dateString = "24-06-2018";
    wrapper.setProps({
      selectedDate: new Date(dateString),
      typeable: true,
      formatTypedDate: function (dateString) {
        let result = dateString.split("/");
        return (
          result[2] + "-" + result[1] + "-" + result[0] + "T00:00:00+01:00"
        );
      },
    });
    const input = wrapper.find("input");
    wrapper.vm.input.value = dateString;
    expect(wrapper.vm.input.value).toEqual(dateString);
    input.trigger("keyup");
    expect(wrapper.emitted().typedDate[0][0].toISOString()).toEqual(
      "2018-06-24T01:00:00.000Z"
    );
    expect(wrapper.vm.formattedValue).toEqual(dateString);
  });

  it("emits closeCalendar when return is pressed", () => {
    const input = wrapper.find("input");
    const blurSpy = jest.spyOn(input.element, "blur");
    input.trigger("keyup", { keyCode: 13 });
    expect(blurSpy).toBeCalled();
  });

  it("clears a typed date if it does not parse", () => {
    const input = wrapper.find("input");
    wrapper.setData({ typedDate: "not a date" });
    input.trigger("blur");
    expect(wrapper.emitted().clearDate).toBeDefined();
  });

  it("doesn't emit the date if typeable=false", () => {
    const wrapper = shallow(DateInput, {
      propsData: {
        format: "dd MMM yyyy",
        translation: en,
        typeable: false,
      },
    });
    const input = wrapper.find("input");
    wrapper.vm.input.value = "2018-04-24";
    input.trigger("keydown");
    input.trigger("keyup");
    expect(wrapper.emitted().typedDate).not.toBeDefined();
  });
});

<script lang="ts">
import { defineComponent } from "vue";

import tippy, {followCursor} from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default defineComponent({
  name: "VaunchTooltip",
  props: {
    tipFor: String,
    tipContent: String
  },
  mounted() {
    console.log(this.tipFor);

    tippy('#'+ this.tipFor, {
      content: this.tipContent,
      followCursor: true,
      plugins: [followCursor],
      arrow: false,
      placement: 'right-end'
    });
  }
});
</script>